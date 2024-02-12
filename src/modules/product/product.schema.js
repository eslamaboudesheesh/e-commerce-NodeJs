import joi from "joi";
import { isObjectID } from "../../middleware/validation.middleware.js";

export const addProduct = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    description: joi.string().min(10).max(200),
    availableItems: joi.number().integer().min(1).required(),
    price: joi.number().integer().min(1).required(),
    discount: joi.number().integer().min(1).max(100).required(),
    expiredAt: joi.date().greater(Date.now()).required(),
    category: joi.string().custom(isObjectID).required(),
    subCategory: joi.string().custom(isObjectID).required(),
    brand: joi.string().custom(isObjectID).required(),
  })
  .required();

export const updateCouponSchema = joi
  .object({
    code: joi.string().length(5).required(),
    discount: joi
      .number()
      .integer()
      .options({ convert: false }) // number only
      .min(1)
      .max(100),
    expiredAt: joi.date().greater(Date.now()),
  })
  .required();

export const deleteProduct = joi
  .object({
    id: joi.string().custom(isObjectID).required(),
  })
  .required();
