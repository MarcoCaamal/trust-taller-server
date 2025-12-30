export const PERMISSIONS = {
  SYSTEM_ROOT: "system.root",

  USERS_READ: "users.read",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DEACTIVATE: "users.deactivate",
  ROLES_ASSIGN: "roles.assign",

  WORKSHOP_UPDATE: "workshop.update",
  TEMPLATES_UPDATE: "templates.update",

  ORDERS_READ: "orders.read",
  ORDERS_CREATE: "orders.create",
  ORDERS_UPDATE: "orders.update",
  ORDERS_CHANGE_STATUS: "orders.change_status",
  ORDERS_ASSIGN: "orders.assign",

  CONCEPTS_READ: "concepts.read",
  CONCEPTS_MANAGE: "concepts.manage",

  EVIDENCE_ADD: "evidence.add",

  NOTES_MANAGE: "notes.manage",

  CATALOG_SUPPLIES_MANAGE: "catalog.supplies.manage",
  CATALOG_SERVICES_MANAGE: "catalog.services.manage",

  PUBLIC_LINK_REGENERATE: "public_link.regenerate",

  REPORTS_VIEW: "reports.view",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
