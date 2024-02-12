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

export const deleteCoupon = joi
  .object({
    code: joi.string().length(5).required(),
  })
  .required();
