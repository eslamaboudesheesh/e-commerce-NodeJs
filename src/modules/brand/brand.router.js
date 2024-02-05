import { Router } from "express";

import { validation } from "../../middleware/validation.middleware.js";
import * as brandController from "./brand.controller.js ";
import * as brandSchema from "./brand.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", isAuth(), isAuthorized("admin"));

export default router;
