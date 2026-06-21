export interface IUserResponse {
    id: string;
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
    createdAt: Date;
    updatedAt: Date;
}
