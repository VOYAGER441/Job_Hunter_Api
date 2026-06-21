import express from "express";
import AuthRouter from "./auth.routes";
import JobSRouter from "./jobs.routes";
import ResumeRouter from "./resume.routes";
import UserRoute from "./user.routes";


const router= express.Router();

// TODO: add middleware to all routes

// system routes
// ###############################################


// public routes
// ###############################################

/**
 * auth endpoints - protected access
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
*/
router.use("/auth", AuthRouter);

// private routes
// ###############################################



// user routes
// ###############################################
// job routes
router.use("/jobs", JobSRouter);

// resource routes
router.use("/resumes", ResumeRouter);

// user routes
router.use("/users", UserRoute);

export default router;