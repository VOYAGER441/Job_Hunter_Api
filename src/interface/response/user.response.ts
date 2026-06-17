export interface IUserResponse {
    id: string;
    appwriteId: string;
    userName: string;
    email: string;
    avatarUrl: string;
    role: string;
    isActive: boolean;
    isDeleted: boolean;
    plan: string;
    createdAt: Date;
    updatedAt: Date;
}
