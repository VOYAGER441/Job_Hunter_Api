import { Types } from "mongoose";

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  planId: string;
  creditPack: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  invoiceId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderResponse {
  id: string;
  userId: string;
  planId: string;
  creditPack: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  invoiceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}