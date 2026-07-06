import env from "@/environment";
import { IJobSearchParams } from "@/interface/request/jobs.request";
import { IAdzunaResponse, IAIDevJobsResponse, IArbeitnowResponse, IFindworkResponse, IMuseJobsApiResponse, INormalizedJob, IRemoteOKJob } from "@/interface/response/jobs.response";
import utils from "@/utils";
import { Log } from "@/utils/logger";
import axios from "axios";



class JobService {


    async getAllJobs(
        queryParams: IJobSearchParams
    ): Promise<INormalizedJob[]> {
        Log.info("JobService:::getAllJobs:::: Fetching jobs with params", queryParams);

        const page = queryParams.page ?? 1;
        const keyword = queryParams.keyword ?? "";
        const location = queryParams.location ?? "";

        const results = await Promise.allSettled([
            // this.fetchMuseJobs(queryParams, page),
            // this.fetchRemoteOKJobs(),
            this.fetchArbeitnowJobs(keyword, location, page),
            // this.fetchGraphQLJobs(keyword, location),
            this.fetchAIDevJobs(),
            this.fetchAdzunaJobs(queryParams, page),
            this.fetchFindworkJobs(keyword, location, page),

        ]);

        const [
            // muse,
            // remoteOK,
            arbeitnow,
            aiDevJobs,
            adzuna,
            findwork,

        ] = results;

        const settled = (
            label: string,
            result: PromiseSettledResult<INormalizedJob[]>
        ): INormalizedJob[] => {
            if (result.status === "fulfilled") {
                Log.info(`JobService:::getAllJobs:::: ${label} fetched`, result.value.length);
                return result.value;
            }
            Log.error(`JobService:::getAllJobs:::: ${label} failed`, result.reason);
            return [];
        };

        return [
            // ...settled("Muse", muse),
            // ...settled("RemoteOK", remoteOK),
            ...settled("Arbeitnow", arbeitnow),
            // ...settled("GraphQL Jobs", graphqlJobs),
            ...settled("AI Dev Jobs", aiDevJobs),
            ...settled("Adzuna", adzuna),
            ...settled("Findwork", findwork),

        ];
    }

    // ─────────────────────────────────────────────
    // Individual fetchers
    // ─────────────────────────────────────────────

    // async fetchMuseJobs(
    //     queryParams: IJobSearchParams,
    //     page: number
    // ): Promise<INormalizedJob[]> {
    //     Log.info("JobService:::fetchMuseJobs:::: Fetching Muse jobs", { queryParams, page });
    //     const query = new URLSearchParams();
    //     if (queryParams.keyword) query.set("keyword", queryParams.keyword);
    //     if (queryParams.category) query.set("category", queryParams.category);
    //     if (queryParams.location) query.set("location", queryParams.location);
    //     if (queryParams.company) query.set("company", queryParams.company);
    //     if (queryParams.level) query.set("level", queryParams.level);
    //     if (queryParams.tags?.length) query.set("tags", queryParams.tags);
    //     query.set("page", String(page));
    //     if (queryParams.sort) query.set("sort", queryParams.sort)

    //     const { data } = await axios.get<IMuseJobsApiResponse>(
    //         `${env.THEMUSE_API_URL}/api/public/jobs?${query.toString()}`
    //     );
    //     Log.info(`JobService:::fetchMuseJobs:::: Fetched ${data.results.length} Muse jobs`);
    //     return data.results.map(utils.jobConveter.fromMuse);
    // }

    // async fetchRemoteOKJobs(): Promise<INormalizedJob[]> {
    //     Log.info("JobService:::fetchRemoteOKJobs:::: Fetching RemoteOK jobs");
    //     const { data } = await axios.get<IRemoteOKJob[]>(
    //         `${env.REMOTEOK_API_URL}/api`,
    //         {
    //             timeout: 10000,
    //             headers: { "User-Agent": "Mozilla/5.0 (compatible; JobHunterBot/1.0)" },
    //         }
    //     );
    //     const valid = data.filter((job): job is IRemoteOKJob => "id" in job);
    //     Log.info(`JobService:::fetchRemoteOKJobs:::: Fetched ${valid.length} RemoteOK jobs`);
    //     return valid.map(utils.jobConveter.fromRemoteOK);
    // }

    async fetchArbeitnowJobs(
        keyword: string,
        location: string,
        page: number
    ): Promise<INormalizedJob[]> {
        Log.info("JobService:::fetchArbeitnowJobs:::: Fetching Arbeitnow jobs", { keyword, location, page });
        const query = new URLSearchParams({ page: String(page) });
        if (keyword) query.set("q", keyword);
        if (location) query.set("location", location);

        const { data } = await axios.get<IArbeitnowResponse>(
            `${env.ARBEITNOW_API_URL}/api/job-board-api?${query.toString()}`
        );
        Log.info(`JobService:::fetchArbeitnowJobs:::: Fetched ${data.data.length} Arbeitnow jobs`);
        return data.data.map(utils.jobConveter.fromArbeitnow);
    }



    async fetchAIDevJobs(): Promise<INormalizedJob[]> {
        Log.info("JobService:::fetchAIDevJobs:::: Fetching AI Dev jobs");
        const { data } = await axios.get<IAIDevJobsResponse>(
            `${env.AI_DEV_JOBS_API_URL}/api/v1/jobs`
        );
        
        const jobs = data.jobs ?? [];
        Log.info(`JobService:::fetchAIDevJobs:::: Fetched ${jobs.length} AI Dev jobs`);
        return jobs.map(utils.jobConveter.fromAIDevJobs);
    }


    async fetchAdzunaJobs(
        queryParams: IJobSearchParams,
        page: number
    ): Promise<INormalizedJob[]> {
        Log.info("JobService:::fetchAdzunaJobs:::: Fetching Adzuna jobs", { queryParams, page });
        const country = "us"; // extend to accept country param if needed
        const query = new URLSearchParams({
            app_id: env.ADZUNA_APP_ID,
            app_key: env.ADZUNA_API_KEY,
            // results_per_page: "20",
            page: String(page),
        });
        if (queryParams.keyword) query.set("what", queryParams.keyword);
        if (queryParams.location) query.set("where", queryParams.location);
        if (queryParams.company) query.set("company", queryParams.company);

        const { data } = await axios.get<IAdzunaResponse>(
            `${env.ADZUNA_API_URL}/v1/api/jobs/gb/search/?${query.toString()}`
        );
        Log.info(`JobService:::fetchAdzunaJobs:::: Fetched ${data.results.length} Adzuna jobs`);
        return data.results.map(utils.jobConveter.fromAdzuna);
    }

    async fetchFindworkJobs(
        keyword: string,
        location: string,
        page: number
    ): Promise<INormalizedJob[]> {
        Log.info("JobService:::fetchFindworkJobs:::: Fetching Findwork jobs", { keyword, location, page });
        const query = new URLSearchParams({ page: String(page) });
        if (keyword) query.set("search", keyword);
        if (location) query.set("location", location);

        const { data } = await axios.get<IFindworkResponse>(
            `${env.FINDWORK_API_URL}/api/jobs/?${query.toString()}`,
            {
                headers: { Authorization: `Token ${env.FINDWORK_API_KEY}` },
            }
        );
        Log.info(`JobService:::fetchFindworkJobs:::: Fetched ${data.results.length} Findwork jobs`);
        return data.results.map(utils.jobConveter.fromFindwork);
    }



}

export default new JobService();