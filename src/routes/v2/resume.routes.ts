import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import resumeController from "@/controllers/v2/resume.controller";
import authMiddleware from "@/middleware/auth.middleware";
const router = express.Router();



// for resume
// ###############################################
/**
 * 
 */
// Build Resume
router.post("/build", authMiddleware.authenticate, apiErrorHandler(resumeController.buildResume))
;
router.put("/finalBuild", authMiddleware.authenticate, apiErrorHandler(resumeController.finalBuildResume));

//  create Resume
router.post("/create", authMiddleware.authenticate, apiErrorHandler(resumeController.createResume));

// get Resume by id
router.get("/get", authMiddleware.authenticate, apiErrorHandler(resumeController.getResumeById));

// get Resume by user
router.get("/resumeByUser", authMiddleware.authenticate, apiErrorHandler(resumeController.getResumeByUser));

// router.put("/update/:id", apiErrorHandler(resumeController.updateResume));
// router.delete("/delete/:id", apiErrorHandler(resumeController.deleteResume));

export default router;
