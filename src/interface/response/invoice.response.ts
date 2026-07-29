import { Types } from "mongoose";

export interface IInvoice {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
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

export interface IInvoiceResponse {
  id: string;
  orderId: string;
  userId: string;
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