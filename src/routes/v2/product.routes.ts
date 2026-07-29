import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import productController from "@/controllers/v2/product.controller";

const router = express.Router();

router.get("/", apiErrorHandler(productController.getProducts));
router.get("/sku/:sku", apiErrorHandler(productController.getProductBySku));

export default router;
