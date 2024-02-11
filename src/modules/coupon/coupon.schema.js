import joi from "joi";
import { isObjectID } from "../../middleware/validation.middleware.js";

export const addCoupon = joi
  .object({
    discount: joi
      .number()
      .integer()
      .options({ convert: false }) // number only
      .min(1)
      .max(100)
      .required(),
    expiredAt: joi.date().greater(Date.now()).required(),
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
