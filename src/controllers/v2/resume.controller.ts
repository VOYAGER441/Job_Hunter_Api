import { Request, Response } from "express";
import { Log } from "@/utils/logger";
import resumeService from "@/services/resume.service";
import utils from "@/utils";

class ResumeController {
    async createResume(req: Request, res: Response) {
        Log.info("ResumeController::::createResume:::: called");
        const { userId } = req.body;

        if (!userId) {
            Log.error("ResumeController::::createResume:::: userId is required");
            return res.status(400).json({ message: "userId is required" });
        }

        Log.info("ResumeController::::createResume:::: userId is valid");
        const resumeBuffer = await resumeService.createResume(userId);
        Log.info("ResumeController::::createResume:::: resume created successfully");
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="resume.pdf"',
            "Content-Length": resumeBuffer.length,
        });
        res.status(utils.http.HttpStatusCodes.OK).send(resumeBuffer);
    }
}

export default new ResumeController();