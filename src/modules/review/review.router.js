import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as reviewController from "./review.controller.js ";
import * as reviewSchema from "./review.schema.js ";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
const router = Router({ mergeParams: true });

router.post(
  "/",
  isAuth,
  isAuthorized("user"),

  validation(reviewSchema.addReview),
  asyncHandler(reviewController.addReview)
);
router.patch(
  "/:id",
  isAuth,
  isAuthorized("user"),
  validation(reviewSchema.updateReview),
  asyncHandler(reviewController.updateReview)
);

export default router;
