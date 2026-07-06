import { Request, Response } from "express";
import { Log } from "@/utils/logger";
import { IJobSearchParams } from "@/interface/request/jobs.request";
import validations from "@/validations";
import { AppError } from "@/error/AppError";
import utils from "@/utils";
import jobService from "@/services/job.service";
import redisService from "@/services/redis.service";
import { INormalizedJob } from "@/interface/response/jobs.response";
class JobController {
    async getAllJobs(req: Request, res: Response) {
        try {
            Log.info("JobController:::getAllJobs:::: fetching all jobs", req.query);

            const { error, value } = validations.jobValidation.jobSearchParamsSchema.validate(req.query);
            if (error) {
                Log.error("JobController:::getAllJobs:::: invalid search params", error);
                throw new AppError(error.details[0].message, utils.http.HttpStatusCodes.BAD_REQUEST);
            }

            const queryParams: IJobSearchParams = value;
            const hash = utils.commonUnit.sh256Convert(JSON.stringify(queryParams));
            const cacheKey = `${utils.cacheConstant.JOB_CACHE_KEY_PREFIX}:${hash}`;

            const cachedResult = await redisService.getJson<INormalizedJob[]>(cacheKey);
            if (cachedResult) {
                Log.info("JobController:::getAllJobs:::: cache hit for key", cacheKey);
                return res.status(utils.http.HttpStatusCodes.OK).json(cachedResult);
            }

            const result = await jobService.getAllJobs(queryParams);
            Log.info("JobController:::getAllJobs:::: fetching all jobs result", result.length);

            res.status(utils.http.HttpStatusCodes.OK).json(result);

            Log.info("JobController:::getAllJobs:::: caching result for key", cacheKey);
            await redisService.setJson(cacheKey, result, utils.cacheConstant.JOB_CACHE_TTL_SECONDS);
        } catch (err) {
            Log.error("JobController:::getAllJobs:::: failed to fetch jobs", err);
            if (err instanceof AppError) throw err;
            throw new AppError("Failed to fetch jobs", utils.http.HttpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new JobController();