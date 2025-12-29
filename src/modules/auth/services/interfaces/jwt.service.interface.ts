import { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";
import { VerifiedToken, VerifyResult } from "../../types/jwt.types";

export interface JwtServiceInterface<T extends object = object> {
  generateToken(payload: T, options?: SignOptions): string;
  verifyToken(token: string, options?: VerifyOptions): VerifyResult<T>;
  verifyTokenOrThrow(token: string, options?: VerifyOptions): VerifiedToken<T>;
  decodeToken(token: string): (JwtPayload & Partial<T>) | null;
}
