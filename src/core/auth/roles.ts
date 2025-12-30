export const ROLE_NAMES = {
  ADMIN: "ADMIN",
  MECHANIC: "MECHANIC",
  RECEPTIONIST: "RECEPTIONIST",
} as const;

export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];
