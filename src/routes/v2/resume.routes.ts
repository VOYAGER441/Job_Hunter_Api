import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import resumeController from "@/controllers/v2/resume.controller";
const router = express.Router();



// for resume
// ###############################################
/**
 * 
 */
router.post("/create", apiErrorHandler(resumeController.createResume));

export default router;
