import { User } from "@modules/users/models/user.model";
import { Tenant } from "@modules/tenants/models/tentant.model";
import { AppError, Result } from "@core/types";

export interface RegisterWorkshopInput {
  name: string;
  slug: string;
  user: {
    email: string;
    name: string;
    lastName: string;
    password: string;
  };
}

export interface RegisterWorkshopOutput {
  tenant: Tenant;
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export interface LoginInput {
  tenantSlug: string;
  email: string;
  password: string;
}

export interface LoginOutput {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export interface AuthServiceInterface {
  registerWorkshop(input: RegisterWorkshopInput): Promise<Result<RegisterWorkshopOutput, AppError>>;
  login(input: LoginInput): Promise<Result<LoginOutput, AppError>>;
}
