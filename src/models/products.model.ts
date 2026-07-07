import collections from "@/database/collections";
import mongoose, { model, Schema } from "mongoose";

export interface IProductPrice {
    INR: number;
    USD: number;
}

export interface IProduct {
    _id: mongoose.Types.ObjectId;
    sku: string;
    name: string;
    credits: number;
    price: IProductPrice;
    popular: boolean;
    isFree: boolean;
    features: string[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


const ProductSchema = new Schema<IProduct>(
    {
        sku: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        credits: { type: Number, required: true },
        price: {
            INR: { type: Number, required: true },
            USD: { type: Number, required: true },
        },
        popular: { type: Boolean, default: false },
        isFree: { type: Boolean, default: false },
        features: { type: [String], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const ProductModel = model<IProduct>(collections.PRODUCTS_COLLECTION, ProductSchema);