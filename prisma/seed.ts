import { PERMISSIONS } from "../src/core/auth/permissions";
import { ROLE_NAMES } from "../src/core/auth/roles";

import { prisma } from '../src/core/database/prisma';

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

const main = async () => {
  const permissionCodes = Object.values(PERMISSIONS);

  for (const code of permissionCodes) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code },
    });
  }

  for (const roleName of Object.values(ROLE_NAMES)) {
    const existingRole = await prisma.role.findFirst({
      where: { name: roleName, isSystem: true },
    });

    const role =
      existingRole ??
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

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
