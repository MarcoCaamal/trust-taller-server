import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import app from "../../src/app";
import { prisma } from "../../src/core/database/prisma";
import { PERMISSIONS } from "../../src/core/auth/permissions";
import { ROLE_NAMES } from "../../src/core/auth/roles";

const seedSystemRoles = async () => {
  const permissionCodes = Object.values(PERMISSIONS);
  for (const code of permissionCodes) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code },
    });
  }

  const rolePermissions: Record<string, string[]> = {
    [ROLE_NAMES.ADMIN]: [PERMISSIONS.SYSTEM_ROOT],
    [ROLE_NAMES.MECHANIC]: [
      PERMISSIONS.ORDERS_READ,
      PERMISSIONS.ORDERS_UPDATE,
      PERMISSIONS.ORDERS_CHANGE_STATUS,
      PERMISSIONS.EVIDENCE_ADD,
      PERMISSIONS.NOTES_MANAGE,
      PERMISSIONS.CONCEPTS_READ,
      PERMISSIONS.CONCEPTS_MANAGE,
    ],
    [ROLE_NAMES.RECEPTIONIST]: [
      PERMISSIONS.ORDERS_READ,
      PERMISSIONS.ORDERS_CREATE,
      PERMISSIONS.ORDERS_UPDATE,
      PERMISSIONS.ORDERS_ASSIGN,
      PERMISSIONS.NOTES_MANAGE,
    ],
  };

  for (const roleName of Object.values(ROLE_NAMES)) {
    const role =
      (await prisma.role.findFirst({ where: { name: roleName, isSystem: true } })) ??
      (await prisma.role.create({
        data: {
          name: roleName,
          isSystem: true,
          description: `${roleName} system role`,
        },
      }));

    const permissionsForRole = rolePermissions[roleName] ?? [];
    for (const permissionCode of permissionsForRole) {
      const permission = await prisma.permission.findUnique({
        where: { code: permissionCode },
      });
      if (!permission) continue;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
};

const resetDb = async () => {
  await prisma.rolePermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.tenant.updateMany({ data: { ownerUserId: null } });
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
};

describe("Auth integration", () => {
  beforeAll(async () => {
    await resetDb();
    await seedSystemRoles();
  });

  beforeEach(async () => {
    await resetDb();
    await seedSystemRoles();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("registers a workshop successfully", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Taller Uno",
      slug: "taller-uno",
      email: "contacto@taller-uno.com",
      user: {
        email: "admin@taller-uno.com",
        name: "Admin",
        lastName: "Uno",
        password: "password123",
      },
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user.passwordHash).toBeUndefined();
  });

  it("rejects register when tenant email is duplicated", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Taller Uno",
      slug: "taller-uno",
      email: "contacto@taller-uno.com",
      user: {
        email: "admin@taller-uno.com",
        name: "Admin",
        lastName: "Uno",
        password: "password123",
      },
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Taller Dos",
      slug: "taller-dos",
      email: "contacto@taller-uno.com",
      user: {
        email: "admin@taller-dos.com",
        name: "Admin",
        lastName: "Dos",
        password: "password123",
      },
    });

    expect(response.status).toBe(409);
    expect(response.headers["content-type"]).toContain("application/problem+json");
    expect(response.body.type).toContain("tenant-email-taken");
  });

  it("rejects login when host is missing", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@taller-uno.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toContain("application/problem+json");
  });

  it("logs in successfully with valid domain and credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Taller Uno",
      slug: "taller-uno",
      email: "contacto@taller-uno.com",
      user: {
        email: "admin@taller-uno.com",
        name: "Admin",
        lastName: "Uno",
        password: "password123",
      },
    });

    const response = await request(app)
      .post("/api/auth/login")
      .set("X-Forwarded-Host", "taller-uno.trust-taller.com")
      .send({
        email: "admin@taller-uno.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });

  it("rejects login when password is invalid", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Taller Uno",
      slug: "taller-uno",
      email: "contacto@taller-uno.com",
      user: {
        email: "admin@taller-uno.com",
        name: "Admin",
        lastName: "Uno",
        password: "password123",
      },
    });

    const response = await request(app)
      .post("/api/auth/login")
      .set("X-Forwarded-Host", "taller-uno.trust-taller.com")
      .send({
        email: "admin@taller-uno.com",
        password: "wrong-password",
      });

    expect(response.status).toBe(401);
    expect(response.headers["content-type"]).toContain("application/problem+json");
  });

  it("rejects login when tenant is inactive", async () => {
    const passwordHash = await bcrypt.hash("password123", 10);
    const tenant = await prisma.tenant.create({
      data: {
        name: "Taller Uno",
        slug: "taller-uno",
        email: "contacto@taller-uno.com",
        domain: "taller-uno.trust-taller.com",
        isActive: false,
      },
    });
    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: "admin@taller-uno.com",
        name: "Admin",
        lastName: "Uno",
        passwordHash,
        isActive: true,
      },
    });
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { ownerUserId: user.id },
    });

    const response = await request(app)
      .post("/api/auth/login")
      .set("X-Forwarded-Host", "taller-uno.trust-taller.com")
      .send({
        email: "admin@taller-uno.com",
        password: "password123",
      });

    expect(response.status).toBe(403);
    expect(response.headers["content-type"]).toContain("application/problem+json");
  });

  it("rejects login when user is inactive", async () => {
    const passwordHash = await bcrypt.hash("password123", 10);
    const tenant = await prisma.tenant.create({
      data: {
        name: "Taller Uno",
        slug: "taller-uno",
        email: "contacto@taller-uno.com",
        domain: "taller-uno.trust-taller.com",
        isActive: true,
      },
    });
    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: "admin@taller-uno.com",
        name: "Admin",
        lastName: "Uno",
        passwordHash,
        isActive: false,
      },
    });
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { ownerUserId: user.id },
    });

    const response = await request(app)
      .post("/api/auth/login")
      .set("X-Forwarded-Host", "taller-uno.trust-taller.com")
      .send({
        email: "admin@taller-uno.com",
        password: "password123",
      });

    expect(response.status).toBe(403);
    expect(response.headers["content-type"]).toContain("application/problem+json");
  });
});
