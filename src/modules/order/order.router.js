import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as orderController from "./order.controller.js ";
import * as orderSchema from "./order.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/",
  isAuth,
  isAuthorized("user"),

  validation(orderSchema.addOrder),
  asyncHandler(orderController.addOrder)
);

//cancel order
router.patch(
  "/:id",
  isAuth,
  isAuthorized("user"),
  validation(orderSchema.cancelOrder),
  asyncHandler(orderController.cancelOrder)
);

export default router;
