import { Request, Response } from "express";
import { AppError } from "@/error/AppError";
import utils from "@/utils";
import { Log } from "@/utils/logger";
import orderService from "@/services/order.service";
import razorpayService from "@/services/razorpay.service";
import { IWebhookPayload } from "@/interface/request/payment.request";

class PaymentWebhookController {
  async handleWebhook(req: Request, res: Response) {
    const signature = req.headers["x-razorpay-signature"] as string;
    const rawBody = req.body;

    if (!signature) {
      Log.error("PaymentWebhookController::handleWebhook:::: missing signature");
      throw new AppError("Missing signature", utils.http.HttpStatusCodes.BAD_REQUEST);
    }

    const isValid = razorpayService.verifyWebhookSignature(
      JSON.stringify(rawBody),
      signature
    );

    if (!isValid) {
      Log.error("PaymentWebhookController::handleWebhook:::: invalid webhook signature");
      throw new AppError("Invalid signature", utils.http.HttpStatusCodes.BAD_REQUEST);
    }

    const payload = rawBody as IWebhookPayload;
    const event = payload.event;
    const paymentEntity = payload.payload.payment.entity;

    Log.info("PaymentWebhookController::handleWebhook:::: received event", { event, paymentId: paymentEntity.id });

    if (event === "payment.captured" || event === "payment.failed") {
      await orderService.handleWebhookPayment(
        paymentEntity.id,
        paymentEntity.order_id,
        paymentEntity.amount,
        paymentEntity.currency,
        paymentEntity.method,
        paymentEntity.status,
        payload
      );
    }

    res.status(utils.http.HttpStatusCodes.OK).json({ success: true });
  }
}

export default new PaymentWebhookController();