import bcrypt from "bcrypt";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { AuthService } from "../../src/modules/auth/services/auth.service";
import { ROLE_NAMES } from "../../src/core/auth/roles";
import type { UserRepositoryInterface } from "../../src/modules/users/repositories/interfaces/user.repository.interface";
import type { TenantRepositoryInterface } from "../../src/modules/tenants/repositories/interfaces/tenant.repository.interface";
import type { JwtServiceInterface } from "../../src/modules/auth/services/interfaces/jwt.service.interface";
import type { User } from "../../src/modules/users/models/user.model";
import type { Tenant } from "../../src/modules/tenants/models/tentant.model";

const makeService = () => {
  const userRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<UserRepositoryInterface>;

  const tenantRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findBySlug: jest.fn(),
    findByDomain: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<TenantRepositoryInterface>;

  const jwtService: JwtServiceInterface = {
    generateToken: jest.fn(() => "token"),
    verifyToken: jest.fn() as jest.MockedFunction<JwtServiceInterface["verifyToken"]>,
    verifyTokenOrThrow: jest.fn() as jest.MockedFunction<
      JwtServiceInterface["verifyTokenOrThrow"]
    >,
    decodeToken: jest.fn() as jest.MockedFunction<JwtServiceInterface["decodeToken"]>,
  };

  const tx = {
    role: {
      findFirst: jest.fn() as jest.MockedFunction<() => Promise<any>>,
    },
    userRole: {
      create: jest.fn() as jest.MockedFunction<(args: any) => Promise<any>>,
    },
  };

  const prisma = {
    $transaction: jest.fn(async (cb: (tx: any) => unknown) => cb(tx)),
  };

  const service = new AuthService(
    prisma as any,
    () => userRepository,
    () => tenantRepository,
    jwtService
  );

  return { service, userRepository, tenantRepository, jwtService, tx, prisma };
};

describe("AuthService.registerWorkshop", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns TENANT_SLUG_TAKEN when slug exists", async () => {
    const { service, tenantRepository } = makeService();
    tenantRepository.findBySlug.mockResolvedValue({ id: 1 } as Tenant);

    const result = await service.registerWorkshop({
      name: "Taller",
      slug: "taller",
      email: "owner@taller.com",
      domain: "taller.trust-taller.com",
      user: {
        email: "admin@taller.com",
        name: "Admin",
        lastName: "One",
        password: "password123",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TENANT_SLUG_TAKEN");
    }
  });

  it("returns TENANT_DOMAIN_TAKEN when domain exists", async () => {
    const { service, tenantRepository } = makeService();
    tenantRepository.findBySlug.mockResolvedValue(null);
    tenantRepository.findByDomain.mockResolvedValue({ id: 1 } as Tenant);

    const result = await service.registerWorkshop({
      name: "Taller",
      slug: "taller",
      email: "owner@taller.com",
      domain: "taller.trust-taller.com",
      user: {
        email: "admin@taller.com",
        name: "Admin",
        lastName: "One",
        password: "password123",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TENANT_DOMAIN_TAKEN");
    }
  });

  it("returns TENANT_EMAIL_TAKEN when tenant email exists", async () => {
    const { service, tenantRepository } = makeService();
    tenantRepository.findBySlug.mockResolvedValue(null);
    tenantRepository.findByDomain.mockResolvedValue(null);
    tenantRepository.findByEmail.mockResolvedValue({ id: 1 } as Tenant);

    const result = await service.registerWorkshop({
      name: "Taller",
      slug: "taller",
      email: "owner@taller.com",
      domain: "taller.trust-taller.com",
      user: {
        email: "admin@taller.com",
        name: "Admin",
        lastName: "One",
        password: "password123",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TENANT_EMAIL_TAKEN");
    }
  });

  it("returns USER_EMAIL_TAKEN when user email exists in tenant", async () => {
    const { service, tenantRepository, userRepository } = makeService();
    tenantRepository.findBySlug.mockResolvedValue(null);
    tenantRepository.findByDomain.mockResolvedValue(null);
    tenantRepository.findByEmail.mockResolvedValue(null);
    tenantRepository.create.mockResolvedValue({ id: 10 } as Tenant);
    userRepository.findByEmail.mockResolvedValue({ id: 1 } as User);

    const result = await service.registerWorkshop({
      name: "Taller",
      slug: "taller",
      email: "owner@taller.com",
      domain: "taller.trust-taller.com",
      user: {
        email: "admin@taller.com",
        name: "Admin",
        lastName: "One",
        password: "password123",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("USER_EMAIL_TAKEN");
    }
  });

  it("returns INTERNAL_ERROR when ADMIN role is missing", async () => {
    const { service, tenantRepository, userRepository, tx } = makeService();
    tenantRepository.findBySlug.mockResolvedValue(null);
    tenantRepository.findByDomain.mockResolvedValue(null);
    tenantRepository.findByEmail.mockResolvedValue(null);
    tenantRepository.create.mockResolvedValue({ id: 10 } as Tenant);
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({
      id: 5,
      tenantId: 10,
      email: "admin@taller.com",
      name: "Admin",
      lastName: "One",
      passwordHash: "hash",
      isActive: true,
    } as User);
    tx.role.findFirst.mockResolvedValue(null);

    const result = await service.registerWorkshop({
      name: "Taller",
      slug: "taller",
      email: "owner@taller.com",
      domain: "taller.trust-taller.com",
      user: {
        email: "admin@taller.com",
        name: "Admin",
        lastName: "One",
        password: "password123",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INTERNAL_ERROR");
    }
  });

  it("returns success with token and user", async () => {
    const { service, tenantRepository, userRepository, jwtService, tx } = makeService();
    tenantRepository.findBySlug.mockResolvedValue(null);
    tenantRepository.findByDomain.mockResolvedValue(null);
    tenantRepository.findByEmail.mockResolvedValue(null);
    tenantRepository.create.mockResolvedValue({ id: 10 } as Tenant);
    tenantRepository.update.mockResolvedValue({ id: 10 } as Tenant);
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({
      id: 5,
      tenantId: 10,
      email: "admin@taller.com",
      name: "Admin",
      lastName: "One",
      passwordHash: "hash",
      isActive: true,
    } as User);
    tx.role.findFirst.mockResolvedValue({ id: 99, name: ROLE_NAMES.ADMIN });

    const result = await service.registerWorkshop({
      name: "Taller",
      slug: "taller",
      email: "owner@taller.com",
      domain: "taller.trust-taller.com",
      user: {
        email: "admin@taller.com",
        name: "Admin",
        lastName: "One",
        password: "password123",
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.token).toBe("token");
      expect(result.value.user.email).toBe("admin@taller.com");
      expect("passwordHash" in result.value.user).toBe(false);
      expect(jwtService.generateToken).toHaveBeenCalled();
    }
  });
});

describe("AuthService.login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns UNAUTHORIZED when tenant is missing", async () => {
    const { service, tenantRepository } = makeService();
    tenantRepository.findByDomain.mockResolvedValue(null);

    const result = await service.login({
      domain: "taller.trust-taller.com",
      email: "admin@taller.com",
      password: "password123",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNAUTHORIZED");
    }
  });

  it("returns FORBIDDEN when tenant is inactive", async () => {
    const { service, tenantRepository } = makeService();
    tenantRepository.findByDomain.mockResolvedValue({
      id: 1,
      isActive: false,
    } as Tenant);

    const result = await service.login({
      domain: "taller.trust-taller.com",
      email: "admin@taller.com",
      password: "password123",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("FORBIDDEN");
    }
  });

  it("returns UNAUTHORIZED when user is missing", async () => {
    const { service, tenantRepository, userRepository } = makeService();
    tenantRepository.findByDomain.mockResolvedValue({
      id: 1,
      isActive: true,
    } as Tenant);
    userRepository.findByEmail.mockResolvedValue(null);

    const result = await service.login({
      domain: "taller.trust-taller.com",
      email: "admin@taller.com",
      password: "password123",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNAUTHORIZED");
    }
  });

  it("returns FORBIDDEN when user is inactive", async () => {
    const { service, tenantRepository, userRepository } = makeService();
    tenantRepository.findByDomain.mockResolvedValue({
      id: 1,
      isActive: true,
    } as Tenant);
    userRepository.findByEmail.mockResolvedValue({
      id: 2,
      tenantId: 1,
      isActive: false,
      passwordHash: "hash",
    } as User);

    const result = await service.login({
      domain: "taller.trust-taller.com",
      email: "admin@taller.com",
      password: "password123",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("FORBIDDEN");
    }
  });

  it("returns UNAUTHORIZED when password is invalid", async () => {
    const { service, tenantRepository, userRepository } = makeService();
    tenantRepository.findByDomain.mockResolvedValue({
      id: 1,
      isActive: true,
    } as Tenant);
    userRepository.findByEmail.mockResolvedValue({
      id: 2,
      tenantId: 1,
      isActive: true,
      passwordHash: "hash",
    } as User);

    const compareSpy =
      jest.spyOn(bcrypt, "compare") as jest.MockedFunction<typeof bcrypt.compare>;
    compareSpy.mockImplementation(async () => false);

    const result = await service.login({
      domain: "taller.trust-taller.com",
      email: "admin@taller.com",
      password: "password123",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNAUTHORIZED");
    }

    compareSpy.mockRestore();
  });

  it("returns token with tenantId when success", async () => {
    const { service, tenantRepository, userRepository, jwtService } = makeService();
    tenantRepository.findByDomain.mockResolvedValue({
      id: 1,
      isActive: true,
    } as Tenant);
    userRepository.findByEmail.mockResolvedValue({
      id: 2,
      tenantId: 1,
      email: "admin@taller.com",
      isActive: true,
      passwordHash: await bcrypt.hash("password123", 10),
    } as User);

    const result = await service.login({
      domain: "taller.trust-taller.com",
      email: "admin@taller.com",
      password: "password123",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.token).toBe("token");
      expect(jwtService.generateToken).toHaveBeenCalledWith(
        expect.objectContaining({ tenantId: 1 })
      );
    }
  });
});
