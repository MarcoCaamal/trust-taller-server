import { DbClient } from "@core/database/prisma";
import { Tenant } from "@modules/tenants/models/tentant.model";
import { TenantRepositoryInterface } from "./interfaces/tenant.repository.interface";

export class PrismaTenantRepository implements TenantRepositoryInterface {

  constructor(private prisma: DbClient) {}

  async findAll(): Promise<Array<Tenant>> {
    return this.prisma.tenant.findMany();
  }

  async findById(id: number): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { slug },
    });
  }

  async create(tenant: Partial<Tenant>): Promise<Tenant> {
    return this.prisma.tenant.create({
      data: tenant as any,
    });
  }

  async update(id: number, tenant: Partial<Tenant>): Promise<Tenant | null> {
    return this.prisma.tenant.update({
      where: { id },
      data: tenant,
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.tenant.delete({
      where: { id },
    });
    return true;
  }
}
