import bcrypt from "bcrypt";
import {
  AuthServiceInterface,
  RegisterWorkshopInput,
  RegisterWorkshopOutput,
  LoginInput,
  LoginOutput
} from "./interfaces/auth.service.interface";
import { UserRepositoryInterface } from "@modules/users/repositories/interfaces/user.repository.interface";
import { TenantRepositoryInterface } from "@modules/tenants/repositories/interfaces/tenant.repository.interface";
import { JwtServiceInterface } from "./interfaces/jwt.service.interface";
import { Prisma, PrismaClient } from "@core/database/generated/prisma/client";
import { RepositoryFactory, Result, AppError, ok, err } from "@core/types";

class AppErrorException extends Error {
  constructor(public appError: AppError) {
    super(appError.message);
  }
}

export class AuthService implements AuthServiceInterface {

  constructor(
    private prisma: PrismaClient,
    private userRepositoryFactory: RepositoryFactory<UserRepositoryInterface>,
    private tenantRepositoryFactory: RepositoryFactory<TenantRepositoryInterface>,
    private jwtService: JwtServiceInterface
  ) {}

  async registerWorkshop(input: RegisterWorkshopInput): Promise<Result<RegisterWorkshopOutput, AppError>> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const userRepository = this.userRepositoryFactory(tx);
        const tenantRepository = this.tenantRepositoryFactory(tx);

        const existingTenant = await tenantRepository.findBySlug(input.slug);
        if (existingTenant) {
          throw new AppErrorException({
            code: "TENANT_SLUG_TAKEN",
            message: "The workshop slug is already taken",
          });
        }

        const existingTenantByDomain = await tenantRepository.findByDomain(input.domain);
        if (existingTenantByDomain) {
          throw new AppErrorException({
            code: "TENANT_DOMAIN_TAKEN",
            message: "The workshop domain is already taken",
          });
        }

        const existingTenantByEmail = await tenantRepository.findByEmail(input.email);
        if (existingTenantByEmail) {
          throw new AppErrorException({
            code: "TENANT_EMAIL_TAKEN",
            message: "The workshop email is already registered",
          });
        }

        const tenant = await tenantRepository.create({
          name: input.name,
          slug: input.slug,
          email: input.email,
          domain: input.domain,
          isActive: true,
        });

        const existingUser = await userRepository.findByEmail(tenant.id, input.user.email);
        if (existingUser) {
          throw new AppErrorException({
            code: "TENANT_EMAIL_TAKEN",
            message: "The email is already registered in this workshop",
          });
        }

        const passwordHash = await bcrypt.hash(input.user.password, 10);

        const user = await userRepository.create({
          tenantId: tenant.id,
          email: input.user.email,
          name: input.user.name,
          lastName: input.user.lastName,
          passwordHash,
          isActive: true,
        });

        const token = this.jwtService.generateToken({
          userId: user.id,
          tenantId: user.tenantId,
          email: user.email,
        });

        const { passwordHash: _, ...userWithoutPassword } = user;

        const updatedTenant = await tenantRepository.update(tenant.id, {
          ownerUserId: user.id,
        });

        return ok({
          tenant: updatedTenant ?? tenant,
          user: userWithoutPassword,
          token,
        });
      });

      return result;
    } catch (error) {
      if (error instanceof AppErrorException) {
        return err(error.appError);
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = Array.isArray(error.meta?.target)
          ? error.meta?.target.join(",")
          : String(error.meta?.target ?? "");

        if (target.includes("slug")) {
          return err({
            code: "TENANT_SLUG_TAKEN",
            message: "The workshop slug is already taken",
          });
        }
        if (target.includes("domain")) {
          return err({
            code: "TENANT_DOMAIN_TAKEN",
            message: "The workshop domain is already taken",
          });
        }
        if (target.includes("tenantId_email")) {
          return err({
            code: "USER_EMAIL_TAKEN",
            message: "The email is already registered in this workshop",
          });
        }
        if (target.includes("email")) {
          return err({
            code: "TENANT_EMAIL_TAKEN",
            message: "The workshop email is already registered",
          });
        }

        return err({
          code: "CONFLICT",
          message: "Unique constraint failed",
        });
      }
      throw error;
    }
  }

  async login(input: LoginInput): Promise<Result<LoginOutput, AppError>> {
    const userRepository = this.userRepositoryFactory();
    const tenantRepository = this.tenantRepositoryFactory();

    const tenant = await tenantRepository.findByDomain(input.domain);
    if (!tenant) {
      return err({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }

    if (!tenant.isActive) {
      return err({
        code: "FORBIDDEN",
        message: "Tenant is inactive",
      });
    }

    const user = await userRepository.findByEmail(tenant.id, input.email);
    if (!user) {
      return err({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return err({
        code: "FORBIDDEN",
        message: "User account is inactive",
      });
    }

    const passwordOk = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordOk) {
      return err({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }

    const token = this.jwtService.generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return ok({
      user: userWithoutPassword,
      token,
    });
  }
}
