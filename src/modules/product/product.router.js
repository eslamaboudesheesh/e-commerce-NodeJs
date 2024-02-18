import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as couponController from "./coupon.controller.js ";
import * as couponSchema from "./product.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { multerUploadCloud } from "../../utils/multerUploadCloud.js";
import reviewRouter from "./../review/review.router.js ";

const router = Router();
router.use("/:productId/review", reviewRouter);
router.post(
  "/",
  isAuth,
  isAuthorized("seller"),
  multerUploadCloud().fields([
    {
      name: "defaultImage",
      maxCount: 1,
    },
    {
      name: "subImages",
      maxCount: 3,
    },
  ]),
  validation(couponSchema.addProduct),
  asyncHandler(couponController.addProduct)
);

router.patch(
  "/:code",
  isAuth,
  isAuthorized("seller"),
  validation(couponSchema.updateCouponSchema),
  asyncHandler(couponController.updateCoupon)
);
router.delete(
  "/:id",
  isAuth,
  isAuthorized("seller"),
  validation(couponSchema.deleteProduct),
  asyncHandler(couponController.deleteProduct)
);

router.get("/", asyncHandler(couponController.allProduct));

export default router;
