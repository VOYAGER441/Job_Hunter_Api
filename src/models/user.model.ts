import mongoose from "mongoose";
import Models from "./model";
import collections from "@/database/collections";
import utils from "@/utils";

export interface IAppliedJob {
  jobTitle: string;
  jobUrl: string;
  appliedAt: Date;
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  userName: string;
  appwriteId: string;
  email: string;
  avatarUrl: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  plan: string;
  resumeCount: number;
  autoApplyCount: number;
  totalCredits: number;
  creditsUsed: number;
  paymentGateWayId: string;
  lastCreditPurchaseAt: Date;
  appliedJobs: IAppliedJob[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    appwriteId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    role: { type: String, default: utils.appConstant.USER_ROLE.USER },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    plan: { type: String, default: utils.appConstant.USER_PLAN.FREE },
    resumeCount: { type: Number, default: 0 },
    autoApplyCount: { type: Number, default: 0 },
    totalCredits: { type: Number, default: utils.appConstant.PLAN_CREDITS.FREE },
    creditsUsed: { type: Number, default: 0 },
    paymentGateWayId: { type: String },
    lastCreditPurchaseAt: { type: Date },
    appliedJobs: {
      type: [
        {
          _id: false,
          jobTitle: { type: String },
          jobUrl: { type: String },
          appliedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

class UserModel extends Models {
  constructor() {
    super(collections.USER_COLLECTION, userSchema);
  }
}

export default new UserModel();