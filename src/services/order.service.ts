import { AppError } from "@/error/AppError";
import { IOrder } from "@/models/order.model";
import { IPayment } from "@/models/payment.model";
import orderModel from "@/models/order.model";
import paymentModel from "@/models/payment.model";
import invoiceModel from "@/models/invoice.model";
import userModel from "@/models/user.model";
import { ProductModel } from "@/models/products.model";
import utils from "@/utils";
import { Log } from "@/utils/logger";
import razorpayService from "./razorpay.service";
import mailService from "./mail.service";
import redisService from "./redis.service";
import mongoose from "mongoose";
import axios from "axios";

class OrderService {
  async getCreditsForPack(sku: string): Promise<number> {
    const product = await ProductModel.findOne({ sku }).lean();
    return product?.credits || 0;
  }

  async createOrder(
    userId: mongoose.Types.ObjectId,
    creditPack: string
  ): Promise<{ order: IOrder; razorpayOrderId: string }> {
    Log.info("OrderService::createOrder:::: creating order", { userId, creditPack });

    const product = await ProductModel.findOne({ sku: creditPack, isActive: true }).lean();
    if (!product) {
      throw new AppError("Invalid credit pack", utils.http.HttpStatusCodes.BAD_REQUEST);
    }

    if (product.isFree) {
      throw new AppError("Cannot purchase free pack", utils.http.HttpStatusCodes.BAD_REQUEST);
    }

    const receipt = `order_${userId.toString().slice(-8)}_${Date.now()}`;
    const razorpayOrderId = await razorpayService.createOrder(
      product.price.INR,
      "INR",
      receipt,
      { userId: userId.toString(), creditPack }
    );

    const order = await orderModel.create({
      userId,
      planId: product.sku,
      creditPack: product.name,
      amount: product.price.INR,
      currency: "INR",
      status: utils.appConstant.ORDER_STATUS.CREATED,
      razorpayOrderId,
      invoiceId: null,
    });

    Log.info("OrderService::createOrder:::: order created", { orderId: order._id });
    return { order, razorpayOrderId };
  }

  async verifyPayment(
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
  ): Promise<{ order: IOrder; payment: IPayment }> {
    Log.info("OrderService::verifyPayment:::: verifying payment", { razorpayPaymentId, razorpayOrderId });

    const isValid = razorpayService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      Log.error("OrderService::verifyPayment:::: invalid signature");
      throw new AppError("Invalid payment signature", utils.http.HttpStatusCodes.BAD_REQUEST);
    }

    const order = await orderModel.getDBModel().findOne({ razorpayOrderId });
    if (!order) {
      throw new AppError("Order not found", utils.http.HttpStatusCodes.NOT_FOUND);
    }

    if (order.status === utils.appConstant.ORDER_STATUS.PAID) {
      Log.info("OrderService::verifyPayment:::: order already paid", { orderId: order._id });
      const existingPayment = await paymentModel.getDBModel().findOne({ razorpayPaymentId });
      return { order, payment: existingPayment! };
    }

    const product = await ProductModel.findOne({ sku: order.planId }).lean();
    const credits = product?.credits || 0;

    const payment = await paymentModel.create({
      orderId: order._id,
      userId: order.userId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount: order.amount,
      currency: "INR",
      method: "razorpay",
      status: utils.appConstant.PAYMENT_STATUS.SUCCESS,
      rawWebhookPayload: {},
    });

    order.status = utils.appConstant.ORDER_STATUS.PAID;
    order.invoiceId = null;
    await orderModel.getDBModel().updateOne({ _id: order._id }, order);

    await this.incrementUserCredits(order.userId, credits, product?.name);

    this.generateAndSendInvoice(order._id, order.userId, order.creditPack, order.amount, order.currency).catch((err) => {
      Log.error("OrderService::verifyPayment:::: invoice generation failed (non-blocking)", err);
    });

    Log.info("OrderService::verifyPayment:::: payment verified and credits added", {
      orderId: order._id,
      paymentId: payment._id,
    });

    return { order, payment };
  }

  async handleWebhookPayment(
    razorpayPaymentId: string,
    razorpayOrderId: string,
    amount: number,
    currency: string,
    method: string,
    status: string,
    rawPayload: object
  ): Promise<{ order: IOrder; payment: IPayment } | null> {
    Log.info("OrderService::handleWebhookPayment:::: processing webhook", { razorpayPaymentId });

    const existingPayment = await paymentModel.getDBModel().findOne({ razorpayPaymentId });
    if (existingPayment) {
      Log.info("OrderService::handleWebhookPayment:::: payment already processed", { razorpayPaymentId });
      return null;
    }

    const order = await orderModel.getDBModel().findOne({ razorpayOrderId });
    if (!order) {
      Log.error("OrderService::handleWebhookPayment:::: order not found", { razorpayOrderId });
      return null;
    }

    const isSuccess = status === "captured";
    const paymentStatus = isSuccess
      ? utils.appConstant.PAYMENT_STATUS.SUCCESS
      : utils.appConstant.PAYMENT_STATUS.FAILED;
    const orderStatus = isSuccess
      ? utils.appConstant.ORDER_STATUS.PAID
      : utils.appConstant.ORDER_STATUS.FAILED;

    const payment = await paymentModel.create({
      orderId: order._id,
      userId: order.userId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature: "",
      amount: amount / 100,
      currency,
      method,
      status: paymentStatus,
      rawWebhookPayload: rawPayload,
    });

    if (isSuccess) {
      order.status = orderStatus;
      await orderModel.getDBModel().updateOne({ _id: order._id }, order);

      const product = await ProductModel.findOne({ sku: order.planId }).lean();
      if (product) {
        await this.incrementUserCredits(order.userId, product.credits, product.name);
      }

      this.generateAndSendInvoice(order._id, order.userId, order.creditPack, amount / 100, currency).catch((err) => {
        Log.error("OrderService::handleWebhookPayment:::: invoice generation failed (non-blocking)", err);
      });

      Log.info("OrderService::handleWebhookPayment:::: payment success, credits added", {
        orderId: order._id,
        paymentId: payment._id,
      });
    } else {
      order.status = orderStatus;
      await orderModel.getDBModel().updateOne({ _id: order._id }, order);
      Log.info("OrderService::handleWebhookPayment:::: payment failed", { orderId: order._id });
    }

    return { order, payment };
  }

  private async generateAndSendInvoice(
    orderId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    creditPack: string,
    amount: number,
    currency: string
  ): Promise<void> {
    try {
      Log.info("OrderService::generateAndSendInvoice:::: generating invoice", { orderId, userId });

      const user = await userModel.getDBModel().findById(userId);
      if (!user) {
        Log.error("OrderService::generateAndSendInvoice:::: user not found", { userId });
        return;
      }

      const invoiceCount = await invoiceModel.getDBModel().countDocuments({});
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(6, "0")}`;

      const response = await axios.post(
        `${process.env.RESUME_SERVER_URL}/v2/internal/invoice/generate`,
        {
          orderId: orderId.toString(),
          userId: userId.toString(),
          invoiceNumber,
          amount,
          currency,
          creditPack,
          userName: user.userName,
          userEmail: user.email,
          createdAt: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-internal-token": process.env.INVOICE_SERVICE_INTERNAL_TOKEN,
          },
        }
      );

      if (!response.data.success) {
        Log.error("OrderService::generateAndSendInvoice:::: invoice generation failed", response.data);
        return;
      }

      const pdfBuffer = Buffer.from(response.data.data.pdfBuffer, "base64");

      const invoice = await invoiceModel.create({
        orderId,
        userId,
        invoiceNumber,
        amountBreakdown: {
          subtotal: amount,
          tax: 0,
          total: amount,
        },
        pdfUrl: "",
        status: utils.appConstant.INVOICE_STATUS.GENERATED,
        emailSentAt: null,
      });

      await orderModel.getDBModel().updateOne({ _id: orderId }, { invoiceId: invoice._id });

      const emailSent = await mailService.sendInvoiceEmail(
        user.email,
        invoiceNumber,
        pdfBuffer,
        amount,
        currency
      );

      if (emailSent) {
        await invoiceModel.getDBModel().updateOne(
          { _id: invoice._id },
          { status: utils.appConstant.INVOICE_STATUS.SENT, emailSentAt: new Date() }
        );
        Log.info("OrderService::generateAndSendInvoice:::: invoice email sent", { invoiceNumber });
      } else {
        await invoiceModel.getDBModel().updateOne(
          { _id: invoice._id },
          { status: utils.appConstant.INVOICE_STATUS.FAILED }
        );
        Log.error("OrderService::generateAndSendInvoice:::: invoice email failed", { invoiceNumber });
      }
    } catch (error) {
      Log.error("OrderService::generateAndSendInvoice:::: error generating invoice", error);
    }
  }

  private async incrementUserCredits(userId: mongoose.Types.ObjectId, credits: number, productName?: string): Promise<void> {
    Log.info("OrderService::incrementUserCredits:::: incrementing credits", { userId, credits, productName });

    const updateFields: Record<string, unknown> = {
      $inc: { totalCredits: credits },
      lastCreditPurchaseAt: new Date(),
    };

    if (productName) {
      const planType = this.getPlanType(productName);
      if (planType) {
        updateFields.plan = planType;
      }
    }

    await userModel.getDBModel().updateOne({ _id: userId }, updateFields);

    const cacheKey = `${utils.cacheConstant.USER_CACHE_KEY_PREFIX}:${userId}`;
    await redisService.delete(cacheKey);
    Log.info("OrderService::incrementUserCredits:::: user cache invalidated", { userId });
  }

  private getPlanType(productName: string): string | null {
    const name = productName.toLowerCase();
    if (name.includes("enterprise") || name.includes("pro_max")) {
      return utils.appConstant.USER_PLAN.PRO_MAX;
    }
    if (name.includes("pro") || name.includes("growth")) {
      return utils.appConstant.USER_PLAN.PRO;
    }
    if (name.includes("starter") || name.includes("free")) {
      return utils.appConstant.USER_PLAN.FREE;
    }
    return null;
  }

  async getOrdersByUser(userId: mongoose.Types.ObjectId): Promise<IOrder[]> {
    return orderModel.getDBModel().find({ userId }).sort({ createdAt: -1 }).lean<IOrder[]>();
  }

  async getOrderById(orderId: mongoose.Types.ObjectId): Promise<IOrder | null> {
    return orderModel.getDBModel().findById(orderId).lean<IOrder>();
  }
}

export default new OrderService();