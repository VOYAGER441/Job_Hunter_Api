
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

export interface IResumeCreateRequest {
  userId: string; // reference to IUser
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