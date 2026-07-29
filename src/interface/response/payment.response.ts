import { Types } from "mongoose";

export interface IPayment {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  rawWebhookPayload?: object;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentResponse {
  id: string;
  orderId: string;
  userId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}