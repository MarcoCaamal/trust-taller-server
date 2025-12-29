import { Tenant } from "@modules/tenants/models/tentant.model";

export interface TenantRepositoryInterface {
  findAll(): Promise<Array<Tenant>>;
  findById(id: number): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  create(tenant: Partial<Tenant>): Promise<Tenant>;
  update(id: number, tenant: Partial<Tenant>): Promise<Tenant | null>;
  delete(id: number): Promise<boolean>;
}
