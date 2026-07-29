import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import orderController from "@/controllers/v2/order.controller";
import authMiddleware from "@/middleware/auth.middleware";
const router = express.Router();

// Order routes (protected)
router.post("/", authMiddleware.authenticate, apiErrorHandler(orderController.createOrder));
router.get("/", authMiddleware.authenticate, apiErrorHandler(orderController.getOrders));
router.get("/:orderId", authMiddleware.authenticate, apiErrorHandler(orderController.getOrderById));

// Payment verification (client callback, protected)
router.post("/payments/verify", authMiddleware.authenticate, apiErrorHandler(orderController.verifyPayment));

export default router;
