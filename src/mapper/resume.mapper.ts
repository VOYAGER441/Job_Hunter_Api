import { IResumeResponse } from "@/interface/response/resume.response";
import { IResume } from "@/models/resume.model";

const mapResumeToResumeResponse = (resume: IResume): IResumeResponse => {
    return {
        id: resume._id.toString(),
        userId: resume.userId.toString(),
        name: resume.name,
        fileKey: resume.fileKey,
        publicUrl: resume.publicUrl,
        phNumber: resume.phNumber,
        emailId: resume.emailId,
        portfolioLink: resume.portfolioLink,
        linkedinLink: resume.linkedinLink,
        githubLink: resume.githubLink,
        summary: resume.summary,
        skills: resume.skills,
        projectName: resume.projectName,
        education: resume.education,
        experience: resume.experience,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
    };
};

export default {
    mapResumeToResumeResponse,
};
