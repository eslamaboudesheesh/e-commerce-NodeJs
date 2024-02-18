import joi from "joi";
import { isObjectID } from "../../middleware/validation.middleware.js";

export const addReview = joi
  .object({
    comment: joi.string().required(),
    rating: joi.number().min(1).max(5).required(),
    productId: joi.string().custom(isObjectID).required(),
  })
  .required();

export const updateReview = joi
  .object({
    id: joi.string().custom(isObjectID).required(),
    productId: joi.string().custom(isObjectID).required(),
    comment: joi.string(),
    rating: joi.number().min(1).max(5),
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
