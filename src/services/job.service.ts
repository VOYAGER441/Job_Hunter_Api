import env from "@/environment";
import { IJobSearchParams } from "@/interface/request/jobs.request";
import { IMuseJob, IMuseJobsApiResponse, INormalizedJob, IRemoteOKJob } from "@/interface/response/jobs.response";
import utils from "@/utils";
import { Log } from "@/utils/logger";
import axios from "axios";

class JobService {
    async getAllJobs(queryParams: IJobSearchParams): Promise<INormalizedJob[]> {
        Log.info("JobService:::getAllJobs:::: Fetching jobs with params", queryParams);
        const query = new URLSearchParams();
        if (queryParams.keyword) query.set("keyword", queryParams.keyword);
        if (queryParams.category) query.set("category", queryParams.category);
        if (queryParams.location) query.set("location", queryParams.location);
        if (queryParams.company) query.set("company", queryParams.company);
        if (queryParams.level) query.set("level", queryParams.level);
        if (queryParams.tags?.length) query.set("tags", queryParams.tags);
        if (queryParams.page) {
            query.set("page", String(queryParams.page));
        } else {
            query.set("page", "1"); // Muse requires page param
        }
        if (queryParams.sort) query.set("sort", queryParams.sort);
        const queryString = query.toString();

        let normalizedMuseJobs: INormalizedJob[] = [];
        let normalizedRemoteOKJobs: INormalizedJob[] = [];
        Log.info("JobService:::getAllJobs:::: Fetching Muse jobs with query", queryString);
        try {
            const museData = await axios.get<IMuseJobsApiResponse>(`${env.THEMUSE_API_URL}/api/public/jobs?${queryString}`);
            normalizedMuseJobs = museData.data.results.map(utils.commonUnit.fromMuse);
        } catch (error) {
            const details = axios.isAxiosError(error) ? error.response?.data : error;
            Log.error("JobService:::getAllJobs:::: Muse API failed", details);
        }
        Log.info("JobService:::getAllJobs:::: Fetched Muse jobs", normalizedMuseJobs.length);

        try {
            const remoteOKData = await axios.get<IRemoteOKJob[]>(`${env.REMOTEOK_API_URL}/api`, {
                timeout: 10000,
                headers: { "User-Agent": "Mozilla/5.0 (compatible; JobHunterBot/1.0)" },
            });
            normalizedRemoteOKJobs = remoteOKData.data
                .filter((job): job is IRemoteOKJob => "id" in job)
                .map(utils.commonUnit.fromRemoteOK);
        } catch (error) {
            const details = axios.isAxiosError(error) ? error.response?.data : error;
            Log.error("JobService:::getAllJobs:::: RemoteOK API failed", details);
        }
        Log.info("JobService:::getAllJobs:::: Fetched RemoteOK jobs", normalizedRemoteOKJobs.length);
        return [...normalizedMuseJobs, ...normalizedRemoteOKJobs];
    }
}

export default new JobService();