import { Request, Response } from "express";
import { Log } from "@/utils/logger";
import { IJwtRequest } from "@/interface/request/jwt.request";
import redisService from "@/services/redis.service";

import utils from "@/utils";
import { IUserResponse } from "@/interface/response/user.response";
import userService from "@/services/user.service";
import userMapper from "@/mapper/user.mapper";
class UserController {
    async getCurrentUser(req: Request, res: Response) {
        Log.info("UserController:::getCurrentUser:::: called");
        const user: IJwtRequest = (req as any).user; // assuming auth middleware attaches user to req

        // check the redis cache for user data using userId as key
        // if found, return cached data
        // if not found, fetch from database, cache it, and return 
        const cacheKey = `${utils.cacheConstant.USER_CACHE_KEY_PREFIX}:${user.userId}`;
        const cachedResult = await redisService.getJson<IUserResponse>(cacheKey);
        if (cachedResult) {
            Log.info("JobController:::getAllJobs:::: cache hit for key", cacheKey);
            return res.status(utils.http.HttpStatusCodes.OK).json(cachedResult);
        }
        Log.info("UserController:::getCurrentUser:::: cache miss for key", cacheKey);
        const userData = await userService.getUserById(utils.commonUnit.stringToObjectId(user.userId));

        // map the data to IUserResponse
        const userReponse = userMapper.mapUserToUserResponse(userData!);

        await redisService.setJson(cacheKey, userReponse, utils.cacheConstant.USER_CACHE_TTL_SECONDS);

        return res.status(utils.http.HttpStatusCodes.OK).json(userReponse);
    }
}
export default new UserController();