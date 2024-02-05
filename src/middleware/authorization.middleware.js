import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";

// Middleware function to check if the user role
export const isAuthorized = (role) => {
  return asyncHandler(async (req, res, next) => {
    const userRole = req.user.role;

    if (userRole !== role) {
      return next(
        new Error(
          "Unauthorized: You do not have permission to perform this action.",
          { cause: StatusCodes.UNAUTHORIZED }
        )
      );
    }

    return next();
  });
};
