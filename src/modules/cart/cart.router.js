import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as cartController from "./cart.controller.js ";
import * as cartSchema from "./cart.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { multerUploadCloud } from "../../utils/multerUploadCloud.js";
const router = Router();

router.post(
  "/",
  isAuth,
  isAuthorized("user"),

  validation(cartSchema.addCart),
  asyncHandler(cartController.addCart)
);
router.patch(
  "/",
  isAuth,
  isAuthorized("user"),
  validation(cartSchema.updateCart),
  asyncHandler(cartController.updateCart)
);
//remove one product from cart
router.patch(
  "/:id",
  isAuth,
  isAuthorized("user"),
  validation(cartSchema.removeCart),
  asyncHandler(cartController.removeCart)
);
//clear all product  in cart
router.put(
  "/clear",
  isAuth,
  isAuthorized("user"),
  asyncHandler(cartController.deleteCart)
);

router.get(
  "/",
  isAuth,
  isAuthorized("admin", "user"),
  validation(cartSchema.userCart),
  asyncHandler(cartController.userCart)
);
export default router;
