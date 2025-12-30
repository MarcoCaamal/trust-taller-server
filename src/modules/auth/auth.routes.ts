import { Router } from "express";

import RegisterWorkshopSchema from "./schemas/register-workshop.schema";
import LoginSchema from "./schemas/login.schema";

import { validate } from "@core/middlewares/validation.middleware";
import { buildAuthController } from "./auth.container";

const router = Router();

const authController = buildAuthController();

router.post(
  '/register',
  validate({ body: RegisterWorkshopSchema }),
  authController.register.bind(authController)
);

router.post(
  '/login',
  validate({ body: LoginSchema }),
  authController.login.bind(authController)
);

export default router;
