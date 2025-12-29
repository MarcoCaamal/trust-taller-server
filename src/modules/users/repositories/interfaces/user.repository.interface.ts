import { User } from "@modules/users/models/user.model";

export interface UserRepositoryInterface {
  findAll(): Promise<Array<User>>;
  findById(id: number): Promise<User | null>;
  findByEmail(tenantId: number, email: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
