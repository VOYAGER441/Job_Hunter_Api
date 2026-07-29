import { Request, Response } from "express";
import utils from "@/utils";
import { Log } from "@/utils/logger";
import productService from "@/services/product.service";

class ProductController {
  async getProducts(req: Request, res: Response) {
    Log.info("ProductController::getProducts:::: fetching products");
    const products = await productService.getActiveProducts();

    res.status(utils.http.HttpStatusCodes.OK).json({
      success: true,
      data: products,
    });
  }

  async getProductBySku(req: Request, res: Response) {
    const { sku } = req.params;
    Log.info("ProductController::getProductBySku:::: fetching product", { sku });
    const product = await productService.getProductBySku(sku);

    if (!product) {
      res.status(utils.http.HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(utils.http.HttpStatusCodes.OK).json({
      success: true,
      data: product,
    });
  }
}

export default new ProductController();
