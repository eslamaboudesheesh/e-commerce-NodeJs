import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as brandController from "./brand.controller.js ";
import * as brandSchema from "./brand.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { multerUploadCloud } from "../../utils/multerUploadCloud.js";

const router = Router();

router.post(
  "/",
  isAuth,
  isAuthorized("admin"),
  multerUploadCloud().single("brand"),
  validation(brandSchema.addBrand),
  asyncHandler(brandController.addBrand)
);

router.patch(
  "/:id",
  isAuth,
  isAuthorized("admin"),
  multerUploadCloud().single("brand"),
  validation(brandSchema.updateBrandSchema),
  asyncHandler(brandController.updateBrand)
);
router.delete(
  "/:id",
  isAuth,
  isAuthorized("admin"),
  validation(brandSchema.deleteBrand),
  asyncHandler(brandController.deleteBrand)
);

router.get("/", asyncHandler(brandController.allBrand));

export default router;
