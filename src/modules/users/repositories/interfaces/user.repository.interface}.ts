export interface UserRepositoryInterface {
  findAll(): Promise<Array<{ id: number; name: string; email: string }>>;
  findById(id: number): Promise<{ id: number; name: string; email: string } | null>;
  create(name: string, email: string): Promise<{ id: number; name: string; email: string }>;
}