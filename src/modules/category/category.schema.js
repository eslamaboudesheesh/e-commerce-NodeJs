import joi from "joi";
import { isObjectID } from "../../middleware/validation.middleware.js";

export const addCategorySchema = joi
  .object({
    nam: joi.string().min(5).max(20).required(),
  })
  .required();

export const updateCategorySchema = joi
  .object({
    nam: joi.string().min(5).max(20),
    id: joi.string().custom(isObjectID).required(),
  })
  .required();

export const deleteCategory = joi
  .object({
    id: joi.string().custom(isObjectID).required(),
  })
  .required();
