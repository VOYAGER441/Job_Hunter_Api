import mongoose from "mongoose";
import { Log } from "@/utils/logger";
import resumeModel, { IResume } from "@/models/resume.model";
import axios from "axios";
import env from "@/environment";
import userModel from "@/models/user.model";
import { AppError } from "@/error/AppError";
import utils from "@/utils";

class ResumeService {
    async createResume(userId: string): Promise<Buffer> {
        Log.info("ResumeService::::createResume:::: called");
        const resumeDoc = await resumeModel
            .getDBModel()
            .findOne<IResume>({ userId }, { _id: 1 });

        if (!resumeDoc) {
            Log.warn("ResumeService::::createResume:::: no resume data found for userId: " + userId);
            throw new AppError("No resume data found for this user", utils.http.HttpStatusCodes.NOT_FOUND);
        }

        Log.info("ResumeService::::createResume:::: resumeDoc " + JSON.stringify(resumeDoc._id))

        try {
            const response = await axios.get<ArrayBuffer>(
                `${env.RESUME_SERVER_URL}/v2/resume/generate/${resumeDoc._id}`,
                { responseType: 'arraybuffer' }
            );

            // update the resume counter in the database in user db 
            if (response.status === 200) {
                Log.info("ResumeService::::createResume:::: resume generated successfully for userId: " + userId);
                await userModel.getDBModel().findByIdAndUpdate(userId, { $inc: { resumeCount: 1 } }); // increment resumeCount by 1
            }

            Log.info("ResumeService::::createResume:::: resume buffer created successfully for userId: " + userId);
            return Buffer.from(response.data);
        } catch (error) {
            Log.error("ResumeService::::createResume:::: error for userId: " + userId, error);
            throw new AppError("Error occurred while creating resume", utils.http.HttpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new ResumeService();