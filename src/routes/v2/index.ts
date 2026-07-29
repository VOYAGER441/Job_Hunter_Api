import express from "express";
import AuthRouter from "./auth.routes";
import JobSRouter from "./jobs.routes";
import ResumeRouter from "./resume.routes";
import UserRoute from "./user.routes";
import OrderRouter from "./order.routes";
import WebhookRouter from "./webhook.routes";
import ProductRouter from "./product.routes";


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

// order & payment routes
router.use("/orders", OrderRouter);

// product routes (public, no auth)
router.use("/products", ProductRouter);

// webhook routes (public, no auth)
router.use("/webhooks", WebhookRouter);

export default router;