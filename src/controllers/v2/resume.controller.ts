import e, { Request, Response } from "express";
import { Log } from "@/utils/logger";
import resumeService from "@/services/resume.service";
import utils from "@/utils";
import resumeMapper from "@/mapper/resume.mapper";
import { IResumeCreateRequest } from "@/interface/request/resume.request";
import validations from "@/validations";
import { AppError } from "@/error/AppError";
import { IJwtRequest } from "@/interface/request/jwt.request";

class ResumeController {

    // build resume
    async buildResume(req: Request, res: Response) {
        Log.info("ResumeController::::buildResume:::: called");
        const user: IJwtRequest = (req as any).user; // assuming auth middleware attaches user to req
        const userId = user.userId;


        if (!userId) {
            Log.error("ResumeController::::buildResume:::: userId is required");
            return res.status(utils.http.HttpStatusCodes.BAD_REQUEST).json({ message: "userId is required" });
        }

        Log.info("ResumeController::::buildResume:::: userId is valid");
        const resume = await resumeService.buildResume(utils.commonUnit.stringToObjectId(userId));
        Log.info("ResumeController::::buildResume:::: resume created successfully");
        // res.set({
        //     "Content-Type": "application/pdf",
        //     "Content-Disposition": 'attachment; filename="resume.pdf"',
        //     "Content-Length": resumeBuffer.length,
        // });
        res.status(utils.http.HttpStatusCodes.OK).send(resume);
    }

    async finalBuildResume(req: Request, res: Response) {
        Log.info("ResumeController::::finalBuildResume:::: called");
        const user: IJwtRequest = (req as any).user; // assuming auth middleware attaches user to req
        const userId = user.userId;
        const htmlData = req.body.htmlData;

        if (!userId) {
            Log.error("ResumeController::::finalBuildResume:::: userId is required");
            return res.status(utils.http.HttpStatusCodes.BAD_REQUEST).json({ message: "userId is required" });
        }

        Log.info("ResumeController::::finalBuildResume:::: userId is valid");
        const resumeBuffer = await resumeService.finalBuildResume(utils.commonUnit.stringToObjectId(userId), htmlData);
        Log.info("ResumeController::::finalBuildResume:::: resume created successfully");
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="resume.pdf"',
            "Content-Length": resumeBuffer.length,
        });
        res.status(utils.http.HttpStatusCodes.OK).send(resumeBuffer);
    }

    // create resume
    async createResume(req: Request, res: Response) {
        Log.info("ResumeController::::createResume:::: called");
        const resumeData: IResumeCreateRequest = req.body;

        // validate required fields
        const { error } = validations.resumeValidation.resumeCreateSchema.validate(resumeData);
        if (error) {
            Log.error("ResumeController::::createResume:::: invalid resume data", error);
            throw new AppError(error.details[0].message, utils.http.HttpStatusCodes.BAD_REQUEST);
        }

        Log.info("ResumeController::::createResume:::: resume data is valid");
        const resumeDoc = await resumeService.createResume(resumeData);
        Log.info("ResumeController::::createResume:::: resume created successfully");
        const resumeResponse = resumeMapper.mapResumeToResumeResponse(resumeDoc);
        res.status(utils.http.HttpStatusCodes.CREATED).json(resumeResponse);
    }

    // get resume by id
    async getResumeById(req: Request, res: Response) {
        Log.info("ResumeController::::getResumeById:::: called");
        const { id } = req.params;

        if (!id) {
            Log.error("ResumeController::::getResumeById:::: id is required");
            return res.status(utils.http.HttpStatusCodes.BAD_REQUEST).json({ message: "id is required" });
        }

        Log.info("ResumeController::::getResumeById:::: id is valid");
        const resumeDoc = await resumeService.getResumeById(utils.commonUnit.stringToObjectId(id));
        Log.info("ResumeController::::getResumeById:::: resume retrieved successfully");
        const resumeResponse = resumeMapper.mapResumeToResumeResponse(resumeDoc);
        res.status(utils.http.HttpStatusCodes.OK).json(resumeResponse);
    }

    // get resume by user
    async getResumeByUser(req: Request, res: Response) {
        Log.info("ResumeController::::getResumeByUser:::: called");
        const user: IJwtRequest = (req as any).user; // assuming auth middleware attaches user to req
        const userId = user.userId;

        if (!userId) {
            Log.error("ResumeController::::getResumeByUser:::: userId is required");
            return res.status(utils.http.HttpStatusCodes.BAD_REQUEST).json({ message: "userId is required" });
        }

        Log.info("ResumeController::::getResumeByUser:::: userId is valid");
        const resumeDoc = await resumeService.getResumeByUser(utils.commonUnit.stringToObjectId(userId));
        Log.info("ResumeController::::getResumeByUser:::: resume retrieved successfully");
        const resumeResponse = resumeMapper.mapResumeToResumeResponse(resumeDoc);
        res.status(utils.http.HttpStatusCodes.OK).json(resumeResponse);
    }
}

export default new ResumeController();