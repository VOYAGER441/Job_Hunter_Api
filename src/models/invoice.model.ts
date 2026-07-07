import mongoose from "mongoose";
import Models from "./model";
import collections from "@/database/collections";
import utils from "@/utils";

export interface IInvoice {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  amountBreakdown: {
    subtotal: number;
    tax?: number;
    total: number;
  };
  pdfUrl: string;
  status: string;
  emailSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const amountBreakdownSchema = new mongoose.Schema(
  {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
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
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    amountBreakdown: { type: amountBreakdownSchema, required: true },
    pdfUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(utils.appConstant.INVOICE_STATUS),
      default: utils.appConstant.INVOICE_STATUS.GENERATED,
      index: true,
    },
    emailSentAt: { type: Date, default: null },
  },
  { versionKey: false, timestamps: true }
);

class InvoiceModel extends Models {
  constructor() {
    super(collections.INVOICES_COLLECTION, invoiceSchema);
  }
}

export default new InvoiceModel();