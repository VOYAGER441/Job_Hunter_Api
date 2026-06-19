import express from "express";
import AuthRouter from "./auth.routes";
import JobSRouter from "./jobs.routes";


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
// jo=b routes
router.use("/jobs", JobSRouter);

// resource routes


export default router;