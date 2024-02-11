import joi from "joi";
import { isObjectID } from "../../middleware/validation.middleware.js";

export const addBrand = joi
  .object({
    nam: joi.string().min(2).max(12).required(),
    categories: joi
      .array()
      .items(joi.string().custom(isObjectID).required())
      .required(),
  })
  .required();

export const updateBrandSchema = joi
  .object({
    id: joi.string().custom(isObjectID).required(),
    nam: joi.string().min(2).max(12),
  })
  .required();

export const deleteBrand = joi
  .object({
    id: joi.string().custom(isObjectID).required(),
  })
  .required();
