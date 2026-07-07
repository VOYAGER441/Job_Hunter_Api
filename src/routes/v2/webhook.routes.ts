import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import paymentWebhookController from "@/controllers/v2/payment.webhook.controller";

const router = express.Router();

// Webhook needs raw body for signature verification
router.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  apiErrorHandler(paymentWebhookController.handleWebhook)
);

export default router;