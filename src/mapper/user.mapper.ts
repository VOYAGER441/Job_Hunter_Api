import { IUserResponse } from "@/interface/response/user.response";
import { IUser } from "@/models/user.model";


const mapUserToUserResponse = (user: IUser): IUserResponse => {
    return {
    id: user._id.toString(),
    userName: user.userName,
    appwriteId: user.appwriteId,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    isActive: user.isActive,
    isDeleted: user.isDeleted,
    plan: user.plan,
    resumeCount: user.resumeCount,
    autoApplyCount: user.autoApplyCount,
    totalCredits: user.totalCredits,
    creditsUsed: user.creditsUsed,
    appliedJobs: user.appliedJobs,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
};
};

export default {
    mapUserToUserResponse
};