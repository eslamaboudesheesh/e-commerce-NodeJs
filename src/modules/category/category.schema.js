import joi from "joi";

export const addCategorySchema = joi
  .object({
    nam: joi.string().min(5).max(20).required(),
  })
  .required();
