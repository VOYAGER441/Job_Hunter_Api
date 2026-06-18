export interface IJobSearchParams {
  keyword?: string;     // matches job title/description text
  category?: string;    // e.g. "Engineering" — real param on Muse, client-side filter on RemoteOK's tags
  location?: string;    // real param on Muse, client-side filter on RemoteOK's location field
  company?: string;     // real param on Muse, client-side filter on RemoteOK's company field
  level?: string;       // real param on Muse (e.g. "Mid Level"); no direct equivalent on RemoteOK
  tags?: string;      // maps to RemoteOK's tags array; no native field on Muse, fold into category/keyword
  page?: number;        // real param on Muse for pagination; RemoteOK has no pagination, so used for client-side slicing
  sort?: "newest" | "relevance"; // real param on Muse; RemoteOK has no sort param, sort client-side by date/epoch
}