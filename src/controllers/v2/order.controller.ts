import { Request, Response } from "express";
import { AppError } from "@/error/AppError";
import utils from "@/utils";
import { Log } from "@/utils/logger";
import orderService from "@/services/order.service";
import { IJwtRequest } from "@/interface/request/jwt.request";
import mongoose from "mongoose";

async function getMongoUserId(req: Request): Promise<mongoose.Types.ObjectId> {
  const jwtUser: IJwtRequest = (req as any).user;
  if (!jwtUser?.userId) {
    throw new AppError("Unauthorized", utils.http.HttpStatusCodes.UNAUTHORIZED);
  }

  return new mongoose.Types.ObjectId(jwtUser.userId);
}

class OrderController {
  createOrder = async (req: Request, res: Response) => {
    const userId = await getMongoUserId(req);
    const { creditPack } = req.body;

    const { order, razorpayOrderId } = await orderService.createOrder(userId, creditPack);

    res.status(utils.http.HttpStatusCodes.CREATED).json({
      success: true,
      data: {
        orderId: order._id,
        razorpayOrderId,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      },
    });
  };

  getOrders = async (req: Request, res: Response) => {
    const userId = await getMongoUserId(req);
    const orders = await orderService.getOrdersByUser(userId);

    res.status(utils.http.HttpStatusCodes.OK).json({
      success: true,
      data: orders,
    });
  };

  getOrderById = async (req: Request, res: Response) => {
    const userId = await getMongoUserId(req);
    const { orderId } = req.params;

    const order = await orderService.getOrderById(new mongoose.Types.ObjectId(orderId));
    if (!order || order.userId.toString() !== userId.toString()) {
      throw new AppError("Order not found", utils.http.HttpStatusCodes.NOT_FOUND);
    }

    res.status(utils.http.HttpStatusCodes.OK).json({
      success: true,
      data: order,
    });
  };

  verifyPayment = async (req: Request, res: Response) => {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      throw new AppError("Missing payment verification fields", utils.http.HttpStatusCodes.BAD_REQUEST);
    }

    const { order, payment } = await orderService.verifyPayment(
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    );

    const creditsAdded = await orderService.getCreditsForPack(order.planId);

    res.status(utils.http.HttpStatusCodes.OK).json({
      success: true,
      data: {
        orderId: order._id,
        paymentId: payment._id,
        status: order.status,
        creditsAdded,
      },
    });
  };
}

export default new OrderController();
