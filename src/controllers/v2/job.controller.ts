import { Request, Response } from "express";
import { Log } from "@/utils/logger";
import { IJobSearchParams } from "@/interface/request/jobs.request";
import validations from "@/validations";
import { AppError } from "@/error/AppError";
import utils from "@/utils";
import jobService from "@/services/job.service";
import redisService from "@/services/redis.service";
class JobController {
    async getAllJobs(req: Request, res: Response) {
        Log.info("JobController:::getAllJobs:::: fetching all jobs", req.query);
        const data: IJobSearchParams = req.query;
        const { error } = validations.jobValidation.jobSearchParamsSchema.validate(data);
        if (error) {
            Log.error("AuthController:::jwtVerify:::: need Appwrite JWT validation", error)
            throw new AppError(error.details[0].message, utils.http.HttpStatusCodes.BAD_REQUEST);
        }

        const key = utils.commonUnit.sh256Convert(JSON.stringify(data));

        // call redis to check if we have cached data for this query
        const cachedResult = await redisService.hashFieldExists(utils.cacheConstant.JOB_CACHE_KEY_PREFIX,key);
        if (cachedResult) {
            Log.info("JobController:::getAllJobs:::: cache hit for key", key);
            const cachedData = await redisService.getHashField(utils.cacheConstant.JOB_CACHE_KEY_PREFIX, key);
            return res.status(utils.http.HttpStatusCodes.OK).json(JSON.parse(cachedData));
        }

        const result = await jobService.getAllJobs(data);
        Log.info("JobController:::getAllJobs:::: fetching all jobs result", result.length);
        res.status(utils.http.HttpStatusCodes.OK).json(result);

        // cache the result in redis as a hash field with the key as the hash field and the value as the stringified result
        await redisService.setHashField(utils.cacheConstant.JOB_CACHE_KEY_PREFIX, key, JSON.stringify(result));

    }
}

export default new JobController();