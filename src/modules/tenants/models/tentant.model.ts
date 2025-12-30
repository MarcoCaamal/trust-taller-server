export interface Tenant {
  id: number;
  name: string;
  slug: string;
  email: string;
  domain: string;
  ownerUserId: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
