import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import JobController from "@/controllers/v2/job.controller";
const router = express.Router();



// for jobs
// ###############################################
/**
 * @openapi
 * /jobs
 * get all jobs
 */
router.get("/", apiErrorHandler(JobController.getAllJobs));

export default router;
