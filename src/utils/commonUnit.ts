import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

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


export function fromRemoteOK(job: RemoteOKJob): NormalizedJob {
  return {
    id: job.id,
    source: "remoteok",
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

export function fromMuse(job: MuseJob): NormalizedJob {
  return {
    id: String(job.id),
    source: "muse",
    title: job.name,
    company: job.company.name,
    description: job.contents,
    location: job.locations.map(l => l.name).join(", "),
    tags: job.tags.map(t => t.name),
    publishedAt: job.publication_date,
    applyUrl: job.refs.landing_page,
  };
}