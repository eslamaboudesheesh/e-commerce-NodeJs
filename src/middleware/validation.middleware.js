import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

export const validation = (schema) => {
  return (req, res, next) => {
    //validation

    const data = { ...req.body, ...req.params, ...req.query };
    //abortEarly avoid to return from first error check for all element
    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult.error) {
      const messageList = validationResult.error.details.map(
        (obj) => obj.message
      );
      return next(new Error(messageList, StatusCodes.BAD_REQUEST));
    }
    return next();
  };
};

export const isObjectID = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("invalid object id");
  }
};
