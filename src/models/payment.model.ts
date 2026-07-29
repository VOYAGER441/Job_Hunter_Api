import mongoose from "mongoose";
import Models from "./model";
import collections from "@/database/collections";
import utils from "@/utils";

export interface IPayment {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
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

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collections.ORDERS_COLLECTION,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collections.USER_COLLECTION,
      required: true,
      index: true,
    },
    razorpayPaymentId: { type: String, required: true, unique: true, index: true },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpaySignature: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    method: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(utils.appConstant.PAYMENT_STATUS),
      default: utils.appConstant.PAYMENT_STATUS.PENDING,
      index: true,
    },
    rawWebhookPayload: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { versionKey: false, timestamps: true }
);

class PaymentModel extends Models {
  constructor() {
    super(collections.PAYMENTS_COLLECTION, paymentSchema);
  }
}

export default new PaymentModel();