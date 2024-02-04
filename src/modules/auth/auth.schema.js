import joi from "joi";

export const signupSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    // mobileNumber: joi.string().pattern(new RegExp('^01[0-5]{1}[0-9]{8}$')).required(),
    // role: joi.string().valid('user', 'seller').required(),
    // gender: joi.string().valid('male', 'female').required(),
    userName: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

export const activateAccount = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const login = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export const confirmEmail = joi
  .object({
    email: joi.string().required().email(),
  })
  .required();

export const resetPass = joi
  .object({
    email: joi.string().required().email(),
    code: joi.string().length(5).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
