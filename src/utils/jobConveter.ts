
// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

import { IAdzunaJob, IAIDevJob, IArbeitnowJob, IFindworkJob, IGraphQLJob, IMuseJob, INormalizedJob, IRemoteOKJob, IUSAJob } from "@/interface/response/jobs.response";
import { JOB_SOURCE } from "./appConstant";


/** Wrap plain text in a <p> so description is always "HTML" */
const textToHtml = (text: string): string =>
  `<p>${text.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`;

/** Convert markdown bold/links to minimal HTML */
const mdToHtml = (md: string): string =>
  md
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br/>");

// ─────────────────────────────────────────────
// RemoteOK
// ─────────────────────────────────────────────

export function fromRemoteOK(job: IRemoteOKJob): INormalizedJob {
  return {
    id: job.id,
    source: JOB_SOURCE.REMOTEOK,
    title: job.position,
    company: job.company,
    description: job.description,
    location: job.location || "Remote",
    tags: job.tags ?? [],
    publishedAt: job.date,
    applyUrl: job.apply_url,
    salaryMin: job.salary_min || undefined,
    salaryMax: job.salary_max || undefined,
  };
}

// ─────────────────────────────────────────────
// The Muse
// ─────────────────────────────────────────────

export function fromMuse(job: IMuseJob): INormalizedJob {
  return {
    id: String(job.id),
    source: JOB_SOURCE.THEMUSE,
    title: job.name,
    company: job.company.name,
    description: job.contents,
    location: job.locations.map((l) => l.name).join(", ") || "Remote",
    tags: job.categories.map((c) => c.name),
    publishedAt: job.publication_date,
    applyUrl: job.refs.landing_page,
  };
}

// ─────────────────────────────────────────────
// Arbeitnow (Tier S)
// ─────────────────────────────────────────────

export function fromArbeitnow(job: IArbeitnowJob): INormalizedJob {
  return {
    id: job.slug,
    source: JOB_SOURCE.ARBEITNOW,
    title: job.title,
    company: job.company_name,
    description: job.description,
    location: job.remote ? `${job.location} (Remote)` : job.location || "Remote",
    tags: [...job.tags, ...job.job_types],
    publishedAt: new Date(job.created_at * 1000).toISOString(),
    applyUrl: job.url,
  };
}

// ─────────────────────────────────────────────
// GraphQL Jobs (Tier S)
// ─────────────────────────────────────────────

export function fromGraphQLJobs(job: IGraphQLJob): INormalizedJob {
  const cities = job.cities.map((c) => c.name);
  const remotes = job.remotes.map((r) => r.name);
  const location =
    [...cities, ...remotes].join(", ") ||
    job.countries.map((c) => c.name).join(", ") ||
    "Remote";

  return {
    id: job.id,
    source: JOB_SOURCE.GRAPHQL_JOBS,
    title: job.title,
    company: job.company.name,
    description: `<p>${mdToHtml(job.description)}</p>`,
    location,
    tags: job.tags.map((t) => t.name),
    publishedAt: job.publishedAt,
    applyUrl: job.applyUrl,
  };
}

// ─────────────────────────────────────────────
// AI Dev Jobs (Tier S)
// ─────────────────────────────────────────────
export function fromAIDevJobs(job: IAIDevJob): INormalizedJob {
  return {
    id: job.id,
    source: JOB_SOURCE.AI_DEV_JOBS,
    title: job.title,
    company: job.company_name,
    description: textToHtml(job.description ?? ""),
    location: job.workplace === "remote" ? "Remote" : job.location || "Remote",
    tags: [...job.tags, job.job_type, job.experience_level].filter(Boolean),
    publishedAt: job.published_at,
    applyUrl: job.apply_url,
    salaryMin: job.salary_min ?? undefined,
    salaryMax: job.salary_max ?? undefined,
  };
}

// ─────────────────────────────────────────────
// Adzuna (Tier A)
// ─────────────────────────────────────────────

export function fromAdzuna(job: IAdzunaJob): INormalizedJob {
  return {
    id: job.id,
    source: JOB_SOURCE.ADZUNA,
    title: job.title,
    company: job.company.display_name,
    description: textToHtml(job.description),
    location: job.location.display_name,
    tags: [job.category.label, job.contract_type, job.contract_time].filter(
      (t): t is string => Boolean(t)
    ),
    publishedAt: job.created,
    applyUrl: job.redirect_url,
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
  };
}

// ─────────────────────────────────────────────
// Findwork (Tier A)
// ─────────────────────────────────────────────

export function fromFindwork(job: IFindworkJob): INormalizedJob {
  return {
    id: String(job.id),
    source: JOB_SOURCE.FINDWORK,
    title: job.role,
    company: job.company_name,
    description: textToHtml(job.text),
    location: job.remote ? `${job.location} (Remote)` : job.location || "Remote",
    tags: [
      ...job.keywords,
      job.employment_type,
      job.experience,
    ].filter((t): t is string => Boolean(t)),
    publishedAt: job.date_posted,
    applyUrl: job.url,
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
  };
}

// ─────────────────────────────────────────────
// USAJOBS (Tier A)
// ─────────────────────────────────────────────

export function fromUSAJobs(job: IUSAJob): INormalizedJob {
  const d = job.MatchedObjectDescriptor;
  const remuneration = d.PositionRemuneration[0];
  const location =
    d.PositionLocation.map((l) => l.LocationName).join(", ") || "USA";

  const salaryMin = remuneration
    ? parseFloat(remuneration.MinimumRange)
    : undefined;
  const salaryMax = remuneration
    ? parseFloat(remuneration.MaximumRange)
    : undefined;

  return {
    id: d.PositionID,
    source: JOB_SOURCE.USAJOBS,
    title: d.PositionTitle,
    company: d.OrganizationName || d.DepartmentName,
    description: textToHtml(
      d.UserArea?.Details?.JobSummary || d.QualificationSummary || ""
    ),
    location,
    tags: [
      ...d.JobCategory.map((c) => c.Name),
      ...d.PositionSchedule.map((s) => s.Name),
      ...d.PositionOfferingType.map((o) => o.Name),
    ],
    publishedAt: d.PublicationStartDate,
    applyUrl: d.ApplyURI[0] ?? d.PositionURI,
    salaryMin: isNaN(salaryMin!) ? undefined : salaryMin,
    salaryMax: isNaN(salaryMax!) ? undefined : salaryMax,
  };
}

