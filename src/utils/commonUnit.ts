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
    const url = `https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${name}`;

    return url;
}

export function sh256Convert(str: string): string {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(str).digest("hex");
}