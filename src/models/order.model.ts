import mongoose from "mongoose";
import Models from "./model";
import collections from "@/database/collections";
import utils from "@/utils";

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  planId: string;
  creditPack: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  invoiceId: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collections.USER_COLLECTION,
      required: true,
      index: true,
    },
    planId: { type: String, required: true },
    creditPack: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    status: {
      type: String,
      enum: Object.values(utils.appConstant.ORDER_STATUS),
      default: utils.appConstant.ORDER_STATUS.CREATED,
      index: true,
    },
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collections.INVOICES_COLLECTION,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

class OrderModel extends Models {
  constructor() {
    super(collections.ORDERS_COLLECTION, orderSchema);
  }
}

export default new OrderModel();