import { IResumeCreateRequest } from "@/interface/request/resume.request";
import Joi from "joi";

const projectSchema = Joi.object({
    projectName: Joi.string().required(),
    description: Joi.string().allow(""),
    techStack: Joi.array().items(Joi.string()),
    projectLink: Joi.string().uri().allow(""),
    githubLink: Joi.string().uri().allow(""),
    startDate: Joi.date(),
    endDate: Joi.date(),
});

const educationSchema = Joi.object({
    instituteName: Joi.string().required(),
    degree: Joi.string().required(),
    fieldOfStudy: Joi.string().allow(""),
    startDate: Joi.date(),
    endDate: Joi.date(),
    grade: Joi.string().allow(""),
});

const experienceSchema = Joi.object({
    companyName: Joi.string().required(),
    designation: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
    isCurrent: Joi.boolean(),
    description: Joi.string().allow(""),
    techStack: Joi.array().items(Joi.string()),
});

export const resumeCreateSchema = Joi.object<IResumeCreateRequest>({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    phNumber: Joi.string().required(),
    emailId: Joi.string().email().required(),
    portfolioLink: Joi.string().uri().allow(""),
    linkedinLink: Joi.string().uri().allow(""),
    githubLink: Joi.string().uri().allow(""),
    summary: Joi.string().allow(""),
    skills: Joi.array().items(Joi.string()),
    projectName: Joi.array().items(projectSchema).required(),
    education: Joi.array().items(educationSchema).required(),
    experience: Joi.array().items(experienceSchema).required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
});

export default {
    resumeCreateSchema,
};