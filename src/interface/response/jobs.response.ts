import { JOB_SOURCE } from "@/utils/appConstant";

export interface IRemoteOKJob {
  slug: string;
  id: string;
  epoch: number;
  date: string; // ISO 8601 date string
  company: string;
  company_logo: string;
  position: string;
  tags: string[];
  description: string; // HTML-formatted string
  location: string;
  apply_url: string;
  salary_min: number;
  salary_max: number;
  logo: string;
  url: string;
}



interface IMuseJobLocation {
  name: string;
}

interface IMuseJobCategory {
  name: string;
}

interface IMuseJobLevel {
  name: string;
  short_name: string;
}

interface IMuseJobTag {
  name: string;
  short_name: string;
}

interface IMuseJobRefs {
  landing_page: string;
}

interface IMuseJobCompany {
  id: number;
  short_name: string;
  name: string;
}

export interface IMuseJob {
  contents: string; // HTML-formatted job description
  name: string;
  type: string; // e.g. "external"
  publication_date: string; // ISO 8601 date string
  short_name: string;
  model_type: string; // e.g. "jobs"
  id: number;
  locations: IMuseJobLocation[];
  categories: IMuseJobCategory[];
  levels: IMuseJobLevel[];
  tags: IMuseJobTag[];
  refs: IMuseJobRefs;
  company: IMuseJobCompany;
}

export interface IMuseJobsApiResponse {
  page: number;
  page_count: number;
  items_per_page: number;
  total: number;
  results: IMuseJob[];
}



export interface INormalizedJob {
  id: string; // cast Muse's number to string
  source: JOB_SOURCE;
  title: string;
  company: string;
  description: string; // HTML
  location: string;
  tags: string[];
  publishedAt: string; // ISO date
  applyUrl: string;
  salaryMin?: number;
  salaryMax?: number;
}