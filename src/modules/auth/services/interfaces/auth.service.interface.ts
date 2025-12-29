import { User } from "@modules/users/models/user.model";
import { Tenant } from "@modules/tenants/models/tentant.model";

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
  email: string;
  password: string;
}

export interface LoginOutput {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export interface AuthServiceInterface {
  registerWorkshop(input: RegisterWorkshopInput): Promise<RegisterWorkshopOutput>;
  login(input: LoginInput): Promise<LoginOutput>;
}
