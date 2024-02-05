import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as categoryController from "./category.controller.js ";
import * as categorySchema from "./category.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { multerUploadCloud } from "../../utils/multerUploadCloud.js";

const router = Router();

router.post(
  "/",
  isAuth,
  isAuthorized("admin"),
  multerUploadCloud().single("category"),
  validation(categorySchema.addCategorySchema),
  asyncHandler(categoryController.addCategory)
);

export default router;
