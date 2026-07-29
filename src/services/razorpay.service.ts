import Razorpay from "razorpay";
import { Log } from "@/utils/logger";
import env from "@/environment";
import crypto from "crypto";

class RazorpayService {
  private client: Razorpay;

  constructor() {
    this.client = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
    Log.info("RazorpayService::constructor:::: Razorpay client initialized");
  }

  async createOrder(
    amount: number,
    currency: string,
    receipt: string,
    notes?: Record<string, string>
  ): Promise<string> {
    Log.info("RazorpayService::createOrder:::: creating order", { amount, currency, receipt });
    const order = await this.client.orders.create({
      amount: amount * 100,
      currency,
      receipt,
      notes,
    });
    Log.info("RazorpayService::createOrder:::: order created", { orderId: order.id });
    return order.id;
  }

  verifySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    const generatedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    return generatedSignature === razorpaySignature;
  }

  verifyWebhookSignature(
    body: string,
    signature: string
  ): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");
    return expectedSignature === signature;
  }
}

export default new RazorpayService();