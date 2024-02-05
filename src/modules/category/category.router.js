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
router.patch(
  "/:id",
  isAuth,
  isAuthorized("admin"),
  multerUploadCloud().single("category"),
  validation(categorySchema.updateCategorySchema),
  asyncHandler(categoryController.updateCategory)
);

router.delete(
  "/:id",
  isAuth,
  isAuthorized("admin"),
  validation(categorySchema.deleteCategory),
  asyncHandler(categoryController.deleteCategory)
);

router.get("/", asyncHandler(categoryController.allCategory));
export default router;
