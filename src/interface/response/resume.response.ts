
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

export interface IResumeResponse {
    id: string; // optional for create, required for update
    userId: string; // reference to IUser
    fileKey: string; // S3 object key for the resume PDF
    publicUrl: string; // Public URL for the resume PDF
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