import bcrypt from "bcrypt";
import {
  AuthServiceInterface,
  RegisterWorkshopInput,
  RegisterWorkshopOutput,
  LoginInput,
  LoginOutput
} from "./interfaces/auth.service.interface";
import { UserRepositoryInterface } from "@modules/users/repositories/interfaces/user.repository.interface";
import { TenantRepositoryInterface } from "@modules/tenants/repositories/interfaces/tenant.repository.interface";
import { JwtServiceInterface } from "./interfaces/jwt.service.interface";
import { HttpException } from "@core/exceptions/http.exception";

export class AuthService implements AuthServiceInterface {

  constructor(
    private userRepository: UserRepositoryInterface,
    private tenantRepository: TenantRepositoryInterface,
    private jwtService: JwtServiceInterface
  ) {}

  async registerWorkshop(input: RegisterWorkshopInput): Promise<RegisterWorkshopOutput> {
    const existingTenant = await this.tenantRepository.findBySlug(input.slug);
    if (existingTenant) {
      throw new HttpException(409, "The workshop slug is already taken");
    }

    const tenant = await this.tenantRepository.create({
      name: input.name,
      slug: input.slug,
      isActive: true,
    });

    const existingUser = await this.userRepository.findByEmail(tenant.id, input.user.email);
    if (existingUser) {
      throw new HttpException(409, "The email is already registered in this workshop");
    }

    const passwordHash = await bcrypt.hash(input.user.password, 10);

    const user = await this.userRepository.create({
      tenantId: tenant.id,
      email: input.user.email,
      name: input.user.name,
      lastName: input.user.lastName,
      passwordHash,
      isActive: true,
    });

    const token = this.jwtService.generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      tenant,
      user: userWithoutPassword,
      token,
    };
  }

  async login(input: LoginInput): Promise<LoginOutput> {
    // Nota: Para login necesitamos saber a qué tenant pertenece el usuario
    // Por ahora asumimos que el email es único globalmente o se pasa el tenantId
    // Esta implementación necesita ajustarse según tu lógica de negocio
    throw new HttpException(501, "Login aún no implementado completamente");
  }
}
