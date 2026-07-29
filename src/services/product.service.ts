import { ProductModel, IProduct } from "@/models/products.model";
import { Log } from "@/utils/logger";
import redisService from "./redis.service";

const PRODUCTS_CACHE_KEY = "products_cache:active";
const PRODUCTS_CACHE_TTL = 3600;

class ProductService {
  async getActiveProducts(): Promise<IProduct[]> {
    Log.info("ProductService::getActiveProducts:::: fetching active products");

    const cached = await redisService.getJson<IProduct[]>(PRODUCTS_CACHE_KEY);
    if (cached) {
      Log.info("ProductService::getActiveProducts:::: cache hit");
      return cached;
    }

    Log.info("ProductService::getActiveProducts:::: cache miss, fetching from DB");
    const products = await ProductModel.find({ isActive: true }).sort({ credits: 1 }).lean<IProduct[]>();
    Log.info("ProductService::getActiveProducts:::: found products", { count: products.length });

    await redisService.setJson(PRODUCTS_CACHE_KEY, products, PRODUCTS_CACHE_TTL);
    Log.info("ProductService::getActiveProducts:::: cached products");

    return products;
  }

  async getProductBySku(sku: string): Promise<IProduct | null> {
    Log.info("ProductService::getProductBySku:::: fetching product by sku", { sku });
    const product = await ProductModel.findOne({ sku, isActive: true }).lean<IProduct>();
    Log.info("ProductService::getProductBySku:::: found product", { sku, found: !!product });
    return product;
  }

  async invalidateCache(): Promise<void> {
    await redisService.delete(PRODUCTS_CACHE_KEY);
    Log.info("ProductService::invalidateCache:::: products cache invalidated");
  }
}

export default new ProductService();
