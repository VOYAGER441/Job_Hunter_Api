import mongoose from "mongoose";
import Models from "./model";
import collections from "@/database/collections";

export interface IProject {
  projectName: string;
  description?: string;
  techStack?: string[];
  projectLink?: string;
  githubLink?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IEducation {
  instituteName: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  grade?: string; // GPA / percentage
}

export interface IExperience {
  companyName: string;
  designation: string;
  startDate: Date;
  endDate?: Date; // optional/undefined if currently working
  isCurrent?: boolean;
  description?: string;
  techStack?: string[];
}

export interface IResume {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // reference to IUser
  name: string;
  phNumber: string;
  emailId: string;
  portfolioLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  summary?: string;
  skills?: string[];
  projectName: IProject[];
  education: IEducation[];
  experience: IExperience[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    projectName: { type: String, required: true },
    description: { type: String },
    techStack: { type: [String], default: [] },
    projectLink: { type: String },
    githubLink: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema<IEducation>(
  {
    instituteName: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String },
  },
  { _id: false }
);

const ExperienceSchema = new mongoose.Schema<IExperience>(
  {
    companyName: { type: String, required: true },
    designation: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    techStack: { type: [String], default: [] },
  },
  { _id: false }
);

const ResumeSchema = new mongoose.Schema<IResume>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collections.USER_COLLECTION,
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    phNumber: { type: String, required: true },
    emailId: { type: String, required: true },
    portfolioLink: { type: String },
    linkedinLink: { type: String },
    githubLink: { type: String },
    summary: { type: String },
    skills: { type: [String], default: [] },
    projectName: { type: [ProjectSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
  },
  { timestamps: true }
);

class ResumeModel extends Models {
  constructor() {
    super(collections.RESUME_COLLECTION, ResumeSchema);
  }
}

export default new ResumeModel();