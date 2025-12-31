import { User } from "@modules/users/models/user.model";

export interface UserRepositoryInterface {
  findAll(tenantId: number): Promise<Array<User>>;
  findById(tenantId: number, id: number): Promise<User | null>;
  findByEmail(tenantId: number, email: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(tenantId: number, id: number, user: Partial<User>): Promise<User | null>;
  delete(tenantId: number, id: number): Promise<boolean>;
}
