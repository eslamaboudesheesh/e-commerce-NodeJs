import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as subCategoryController from "./subCategory.controller.js ";
import * as subCategorySchema from "./subCategory.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { multerUploadCloud } from "../../utils/multerUploadCloud.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  isAuth,
  isAuthorized("admin"),
  multerUploadCloud().single("subCategory"),
  validation(subCategorySchema.addSubCategory),
  asyncHandler(subCategoryController.addSubCategory)
);
router.patch(
  "/:id",
  isAuth,
  isAuthorized("admin"),
  multerUploadCloud().single("subCategory"),
  validation(subCategorySchema.updateSubCategorySchema),
  asyncHandler(subCategoryController.updateCategory)
);

router.delete(
  "/:id",
  isAuth,
  isAuthorized("admin"),
  validation(subCategorySchema.deleteSubCategory),
  asyncHandler(subCategoryController.deleteSubCategory)
);

router.get(
  "/",
  validation(subCategorySchema.allSubCategory),
  asyncHandler(subCategoryController.allSubCategory)
);
export default router;
