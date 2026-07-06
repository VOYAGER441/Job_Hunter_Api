// ─────────────────────────────────────────────
// Normalized output
// ─────────────────────────────────────────────

import { JOB_SOURCE } from "@/utils/appConstant";

 
export interface INormalizedJob {
  id: string;
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
 
// ─────────────────────────────────────────────
// Search params
// ─────────────────────────────────────────────
 
export interface IJobSearchParams {
  keyword?: string;
  category?: string;
  location?: string;
  company?: string;
  level?: string;
  tags?: string[];
  page?: number;
  sort?: string;
}
 
// ─────────────────────────────────────────────
// RemoteOK
// ─────────────────────────────────────────────
 
export interface IRemoteOKJob {
  id: string;
  position: string;
  company: string;
  description: string;
  location: string;
  tags: string[];
  date: string;
  apply_url: string;
  url: string;
  salary_min?: number;
  salary_max?: number;
}
 
// ─────────────────────────────────────────────
// The Muse
// ─────────────────────────────────────────────
 
export interface IMuseJob {
  id: number;
  name: string;
  short_name: string;
  type: string;
  publication_date: string;
  short_description: string;
  contents: string; // HTML
  refs: { landing_page: string };
  locations: { name: string }[];
  categories: { name: string }[];
  levels: { name: string; short_name: string }[];
  company: {
    id: number;
    name: string;
    short_name: string;
  };
}
 
export interface IMuseJobsApiResponse {
  page: number;
  page_count: number;
  items_per_page: number;
  took: number;
  timed_out: boolean;
  total: number;
  results: IMuseJob[];
}
 
// ─────────────────────────────────────────────
// Arbeitnow (Tier S)
// ─────────────────────────────────────────────
 
export interface IArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string; // HTML
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number; // Unix timestamp
}
 
export interface IArbeitnowResponse {
  data: IArbeitnowJob[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
 
// ─────────────────────────────────────────────
// GraphQL Jobs (Tier S)
// ─────────────────────────────────────────────
 
export interface IGraphQLJob {
  id: string;
  title: string;
  slug: string;
  commitment: { title: string };
  cities: { name: string }[];
  countries: { name: string; isoCode: string }[];
  remotes: { name: string }[];
  description: string; // Markdown
  applyUrl: string;
  publishedAt: string; // ISO
  tags: { name: string }[];
  company: {
    name: string;
    websiteUrl: string;
    logoUrl: string | null;
  };
}
 
export interface IGraphQLJobsResponse {
  data: {
    jobs: IGraphQLJob[];
  };
}
 
// ─────────────────────────────────────────────
// AI Dev Jobs (Tier S) — RSS-backed REST
// ─────────────────────────────────────────────
export interface IAIDevJob {
  id: string;
  title: string;
  slug: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  workplace: string;       // "hybrid" | "remote" | "onsite"
  job_type: string;        // "full-time" | "part-time" etc.
  experience_level: string;
  tags: string[];
  apply_url: string;
  published_at: string;    // ISO
  company_name: string;
  company_logo_url: string;
  url: string;
}

export interface IAIDevJobsResponse {
  has_next: boolean;
  jobs: IAIDevJob[];
}
 
// ─────────────────────────────────────────────
// Adzuna (Tier A)
// ─────────────────────────────────────────────
 
export interface IAdzunaJob {
  id: string;
  title: string;
  description: string;
  created: string; // ISO
  redirect_url: string;
  location: { display_name: string; area: string[] };
  category: { label: string; tag: string };
  company: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: "0" | "1";
  contract_type?: string;
  contract_time?: string;
}
 
export interface IAdzunaResponse {
  results: IAdzunaJob[];
  count: number;
  mean: number;
}
 
// ─────────────────────────────────────────────
// Findwork (Tier A)
// ─────────────────────────────────────────────
 
export interface IFindworkJob {
  id: number;
  role: string;
  company_name: string;
  employment_type: string | null;
  experience: string | null;
  keywords: string[];
  location: string;
  remote: boolean;
  date_posted: string; // ISO
  url: string;
  text: string; // plain text description
  equity: boolean;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
}
 
export interface IFindworkResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IFindworkJob[];
}
 
// ─────────────────────────────────────────────
// USAJOBS (Tier A)
// ─────────────────────────────────────────────
 
export interface IUSAJob {
  MatchedObjectId: string;
  MatchedObjectDescriptor: {
    PositionID: string;
    PositionTitle: string;
    PositionURI: string;
    ApplyURI: string[];
    PositionLocation: {
      LocationName: string;
      CountryCode: string;
      CityName: string;
    }[];
    OrganizationName: string;
    DepartmentName: string;
    JobCategory: { Name: string; Code: string }[];
    JobGrade: { Code: string }[];
    PositionSchedule: { Name: string; Code: string }[];
    PositionOfferingType: { Name: string; Code: string }[];
    QualificationSummary: string;
    PositionRemuneration: {
      MinimumRange: string;
      MaximumRange: string;
      RateIntervalCode: string;
    }[];
    PublicationStartDate: string;
    ApplicationCloseDate: string;
    UserArea: {
      Details: {
        JobSummary: string;
        WhoMayApply: { Name: string; Code: string };
        LowGrade: string;
        HighGrade: string;
      };
    };
  };
}
 
export interface IUSAJobsResponse {
  LanguageCode: string;
  SearchParameters: Record<string, string>;
  SearchResult: {
    SearchResultCount: number;
    SearchResultCountAll: number;
    SearchResultItems: IUSAJob[];
  };
}
