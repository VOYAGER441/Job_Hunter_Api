import { IMuseJob, INormalizedJob, IRemoteOKJob } from "@/interface/response/jobs.response";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { JOB_SOURCE } from "./appConstant";

export const toString = (str: any) => {
    const result = str + "";
    return result;
};

export const stringToObjectId = (id: string) => {
    return new ObjectId(id);
};

const generatedIds = new Set<string>();

export const generateUUID = () => {
    let id;
    do {
        id = uuidv4();
    } while (generatedIds.has(id));
    generatedIds.add(id);
    return id;
};


export function generateAvatarUrl(name: string): string {
    const url = `https://api.dicebear.com/9.x/lorelei/svg?seed=${name}`;

    return url;
}


export function fromRemoteOK(job: IRemoteOKJob): INormalizedJob {
  return {
    id: job.id,
    source: JOB_SOURCE.REMOTEOK,
    title: job.position,
    company: job.company,
    description: job.description,
    location: job.location,
    tags: job.tags,
    publishedAt: job.date,
    applyUrl: job.apply_url,
    salaryMin: job.salary_min || undefined,
    salaryMax: job.salary_max || undefined,
  };
}

export function fromMuse(job: IMuseJob): INormalizedJob {
  return {
    id: String(job.id),
    source: JOB_SOURCE.MUSE,
    title: job.name,
    company: job.company.name,
    description: job.contents,
    location: job.locations.map(l => l.name).join(", "),
    tags: job.tags.map(t => t.name),
    publishedAt: job.publication_date,
    applyUrl: job.refs.landing_page,
  };
}

export function sh256Convert(str: string): string {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(str).digest("hex");
}