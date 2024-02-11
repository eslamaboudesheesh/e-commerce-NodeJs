import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as couponController from "./coupon.controller.js ";
import * as couponSchema from "./coupon.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { multerUploadCloud } from "../../utils/multerUploadCloud.js";

const router = Router();

router.post(
  "/",
  isAuth,
  isAuthorized("seller"),
  validation(couponSchema.addCoupon),
  asyncHandler(couponController.addCoupon)
);

router.patch(
  "/:id",
  isAuth,
  isAuthorized("admin"),
  validation(couponSchema.updateBrandSchema),
  asyncHandler(couponController.updateBrand)
);
router.delete(
  "/:id",
  isAuth,
  isAuthorized("admin"),
  validation(couponSchema.deleteBrand),
  asyncHandler(couponController.deleteBrand)
);

router.get("/", asyncHandler(couponController.allBrand));

export default router;
