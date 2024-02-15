import joi from "joi";
import { isObjectID } from "../../middleware/validation.middleware.js";

export const addOrder = joi
  .object({
    phone: joi.string().required(),
    address: joi.string().required(),
    payment: joi.string().valid("cash", "visa"),
    coupon: joi.string().length(5),
  })
  .required();

export const updateCart = joi
  .object({
    productId: joi.string().custom(isObjectID).required(),
    quantity: joi.number().integer().min(1).required(),
  })
  .required();

export const removeCart = joi
  .object({
    productId: joi.string().custom(isObjectID).required(),
  })
  .required();

export const userCart = joi
  .object({
    cartId: joi.string().custom(isObjectID),
  })
  .required();
