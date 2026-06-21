import { Request, Response } from "express";
import { Log } from "@/utils/logger";
class UserController {
    async getCurrentUser(req: Request, res: Response) {
        Log.info("UserController:::getCurrentUser:::: called");
        
    }
}
export default new UserController();