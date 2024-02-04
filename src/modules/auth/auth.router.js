import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as authController from "./auth.controller.js";
import * as authSchema from "./auth.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// register
router.post(
  "/register",
  validation(authSchema.signupSchema),
  asyncHandler(authController.register)
);
// active account
router.post(
  "/activate_account/:token",
  validation(authSchema.activateAccount),
  asyncHandler(authController.activateAccount)
);

// login
router.post(
  "/login",
  validation(authSchema.login),
  asyncHandler(authController.login)
);

router.patch(
  "/forgetCode",
  validation(authSchema.confirmEmail),
  asyncHandler(authController.sendForgetCode)
);
// reset password
router.patch(
  "/resetPassword",
  validation(authSchema.resetPass),
  asyncHandler(authController.resetPassWord)
);

export default router;
