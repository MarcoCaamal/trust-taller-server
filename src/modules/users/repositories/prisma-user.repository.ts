import { PrismaClient } from "@core/database/generated/prisma/client";

import { User, UserCreateInput } from "@modules/users/models/user.model";
import { UserRepositoryInterface } from "./interfaces/user.repository.interface";


export class PrismaUserRepository implements UserRepositoryInterface {

  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Array<User>> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
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

  async update(id: number, user: UserCreateInput): Promise<User | null> {
    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.user.delete({
      where: { id },
    });
    return true;
  }
}
