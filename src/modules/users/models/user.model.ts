export interface User {
  id: number;
  tenantId: number;
  email: string;
  name: string;
  lastName: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCreateInput = Omit<User, "id" | "createdAt" | "updatedAt">;
