import joi from "joi";
import { isObjectID } from "../../middleware/validation.middleware.js";

export const addSubCategorySchema = joi
  .object({
    nam: joi.string().min(5).max(20).required(),
    category: joi.string().custom(isObjectID).required(),
  })
  .required();

export const updateSubCategorySchema = joi
  .object({
    nam: joi.string().min(5).max(20),
    id: joi.string().custom(isObjectID).required(),
    category: joi.string().custom(isObjectID).required(),
  })
  .required();

export const deleteSubCategory = joi
  .object({
    id: joi.string().custom(isObjectID).required(),
    category: joi.string().custom(isObjectID).required(),
  })
  .required();

export const allSubCategory = joi
  .object({
    category: joi.string().custom(isObjectID).required(),
  })
  .required();
