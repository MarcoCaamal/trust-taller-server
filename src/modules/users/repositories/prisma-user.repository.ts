import { DbClient } from "@core/database/prisma";

import { User, UserCreateInput } from "@modules/users/models/user.model";
import { UserRepositoryInterface } from "./interfaces/user.repository.interface";


export class PrismaUserRepository implements UserRepositoryInterface {

  constructor(private prisma: DbClient) {}

  async findAll(tenantId: number): Promise<Array<User>> {
    return this.prisma.user.findMany({
      where: { tenantId },
    });
  }

  async findById(tenantId: number, id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, tenantId },
    });
  }

  async findByEmail(tenantId: number, email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
    });
  }

  async create(user: UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: user,
    });
  }

  async update(tenantId: number, id: number, user: UserCreateInput): Promise<User | null> {
    const result = await this.prisma.user.updateMany({
      where: { id, tenantId },
      data: user,
    });
    if (result.count === 0) return null;
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async delete(tenantId: number, id: number): Promise<boolean> {
    const result = await this.prisma.user.deleteMany({
      where: { id, tenantId },
    });
    return result.count > 0;
  }
}
