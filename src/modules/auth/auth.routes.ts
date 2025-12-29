import { Router } from "express";

import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { JwtService } from "./services/jwt.service";
import RegisterWorkshopSchema from "./schemas/register-workshop.schema";

import { PrismaUserRepository } from "@modules/users/repositories/prisma-user.repository";
import { PrismaTenantRepository } from "@modules/tenants/repositories/prisma-tenant.repository";

import { prisma } from "@core/database/prisma";
import { validate } from "@core/middlewares/validation.middleware";
import config from "@core/config/app.config";

const router = Router();

const userRepository = new PrismaUserRepository(prisma);
const tenantRepository = new PrismaTenantRepository(prisma);

const jwtService = new JwtService({
  secret: config.jwtSecret,
  signDefaults: {
    expiresIn: "1h",
  },
});

const authService = new AuthService(userRepository, tenantRepository, jwtService);

const authController = new AuthController(authService);

router.post(
  '/register',
  validate({ body: RegisterWorkshopSchema }),
  authController.register.bind(authController)
);

router.post(
  '/login',
  authController.login.bind(authController)
);

export default router;
