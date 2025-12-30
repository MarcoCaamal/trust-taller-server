import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { JwtService } from "./services/jwt.service";
import { PrismaUserRepository } from "@modules/users/repositories/prisma-user.repository";
import { PrismaTenantRepository } from "@modules/tenants/repositories/prisma-tenant.repository";
import { DbClient, prisma } from "@core/database/prisma";
import config from "@core/config/app.config";

export const buildAuthController = (): AuthController => {
  const userRepositoryFactory = (client?: DbClient) =>
    new PrismaUserRepository(client ?? prisma);
  const tenantRepositoryFactory = (client?: DbClient) =>
    new PrismaTenantRepository(client ?? prisma);

  const jwtService = new JwtService({
    secret: config.jwtSecret,
    signDefaults: {
      expiresIn: "1h",
    },
  });

  const authService = new AuthService(
    prisma,
    userRepositoryFactory,
    tenantRepositoryFactory,
    jwtService
  );

  return new AuthController(authService);
};
