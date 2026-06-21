import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import userController from "@/controllers/v2/user.controller";
import authMiddleware from "@/middleware/auth.middleware";
const router = express.Router();



// for user
// ###############################################
/**
 * 
 */
router.get("/me", authMiddleware.authenticate, apiErrorHandler(userController.getCurrentUser));

export default router;
