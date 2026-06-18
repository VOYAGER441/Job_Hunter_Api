import { IJobSearchParams } from "@/interface/request/jobs.request";
import Joi from "joi";

export const jobSearchParamsSchema = Joi.object<IJobSearchParams>({
  keyword: Joi.string().trim().max(100).optional(),
  category: Joi.string().trim().max(100).optional(),
  location: Joi.string().trim().max(100).optional(),
  company: Joi.string().trim().max(100).optional(),
  level: Joi.string().trim().max(50).optional(),
  tags: Joi.array().items(Joi.string().trim()).single().optional(),
  page: Joi.number().integer().min(1).optional(),
  sort: Joi.string().valid("newest", "relevance").optional(),
});

export default {
  jobSearchParamsSchema,
};