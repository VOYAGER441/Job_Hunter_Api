import mongoose from "mongoose";
import { Log } from "@/utils/logger";
import resumeModel, { IResume } from "@/models/resume.model";
import axios from "axios";
import env from "@/environment";
import userModel from "@/models/user.model";
import { AppError } from "@/error/AppError";
import utils from "@/utils";
import { IResumeCreateRequest } from "@/interface/request/resume.request";
import userService from "./user.service";

class ResumeService {

    // build resume
    async buildResume(userId: mongoose.Types.ObjectId): Promise<string> {
        Log.info("ResumeService::::buildResume:::: called");
        const resumeDoc = await this.getResumeByUser(userId);

        if (!resumeDoc) {
            Log.warn("ResumeService::::buildResume:::: no resume data found for userId: " + userId);
            throw new AppError("No resume data found for this user", utils.http.HttpStatusCodes.NOT_FOUND);
        }

        Log.info("ResumeService::::buildResume:::: resumeDoc " + JSON.stringify(resumeDoc._id))

        try {
            const response = await axios.get<string>(`${env.RESUME_SERVER_URL}/v2/resume/generate/${resumeDoc._id}`);

            Log.info("ResumeService::::buildResume:::: resume buffer created successfully for userId: " + userId);
            return response.data;
        } catch (error) {
            Log.error("ResumeService::::buildResume:::: error for userId: " + userId, error);
            throw new AppError("Error occurred while creating resume", utils.http.HttpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    // final build resume
    async finalBuildResume(userId: mongoose.Types.ObjectId, htmlData: string): Promise<Buffer> {
        Log.info("ResumeService::::finalBuildResume:::: called");

        const user = await userService.getUserById(userId);
        if (!user) {
            Log.warn("ResumeService::::finalBuildResume:::: no user found for userId: " + userId);
            throw new AppError("No user found for this userId", utils.http.HttpStatusCodes.NOT_FOUND);
        }

        const resumeDoc = await this.getResumeByUser(userId);
        Log.info("ResumeService::::finalBuildResume:::: resumeDoc " + JSON.stringify(resumeDoc._id))
        try {
            const response = await axios.post<ArrayBuffer>(`${env.RESUME_SERVER_URL}/v2/resume/generateAndStore/${resumeDoc._id}`);

            // update the resume counter in the database in user db 
            if (response.status === 200) {
                Log.info("ResumeService::::finalBuildResume:::: resume generated successfully for userId: " + userId);
                await userModel.getDBModel().findByIdAndUpdate(userId, { $inc: { resumeCount: 1 } }); // increment resumeCount by 1
            }

            Log.info("ResumeService::::buildResume:::: resume buffer created successfully for userId: " + userId);
            return Buffer.from(response.data);
        } catch (error) {
            Log.error("ResumeService::::buildResume:::: error for userId: " + userId, error);
            throw new AppError("Error occurred while creating resume", utils.http.HttpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    // get resume by id
    async getResumeById(resumeId: mongoose.Types.ObjectId): Promise<IResume> {
        Log.info("ResumeService::::getResumeById:::: called");
        const resumeDoc = await resumeModel.getDBModel().findById<IResume>({ _id: resumeId });
        if (!resumeDoc) {
            Log.warn("ResumeService::::getResumeById:::: no resume data found for id: " + resumeId);
            throw new AppError("No resume data found for this id", utils.http.HttpStatusCodes.NOT_FOUND);
        }
        return resumeDoc;
    }

    // get resume by user id
    async getResumeByUser(userId: mongoose.Types.ObjectId): Promise<IResume> {
        Log.info("ResumeService::::getResumeByUser:::: called");
        const resumeDoc = await resumeModel.getDBModel().findOne<IResume>({ userId });
        if (!resumeDoc) {
            Log.warn("ResumeService::::getResumeByUser:::: no resume data found for userId: " + userId);
            throw new AppError("No resume data found for this user", utils.http.HttpStatusCodes.NOT_FOUND);
        }
        return resumeDoc;
    }

    // create resume
    async createResume(resumeData: IResumeCreateRequest): Promise<IResume> {
        Log.info("ResumeService::::createResume:::: called");
        const user = await userService.getUserById(utils.commonUnit.stringToObjectId(resumeData.userId));
        if (!user) {
            Log.warn("ResumeService::::createResume:::: no user found for userId: " + resumeData.userId);
            throw new AppError("No user found for this userId", utils.http.HttpStatusCodes.NOT_FOUND);
        }
        Log.info("ResumeService::::createResume:::: user found for userId: " + resumeData.userId);
        const resumeDoc = await resumeModel.getDBModel().create(resumeData);
        Log.info("ResumeService::::createResume:::: resume created successfully for userId: " + resumeData.userId);
        return resumeDoc;
    }

}

export default new ResumeService();