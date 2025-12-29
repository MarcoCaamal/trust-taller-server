import jwt from "jsonwebtoken";
import type { Secret, SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";
import { JwtServiceInterface } from "./interfaces/jwt.service.interface";
import { VerifiedToken, VerifyResult, JwtServiceConfig } from "../types/jwt.types";

export class JwtService<T extends object = object> implements JwtServiceInterface<T> {
  private readonly secret: Secret;
  private readonly signDefaults: SignOptions;
  private readonly verifyDefaults: VerifyOptions;

  constructor(config: JwtServiceConfig) {
    this.secret = config.secret;
    this.signDefaults = config.signDefaults ?? {};
    this.verifyDefaults = config.verifyDefaults ?? {};
  }

  generateToken(payload: T, options: SignOptions = {}): string {
    return jwt.sign(payload, this.secret, { ...this.signDefaults, ...options });
  }

  verifyToken(token: string, options: VerifyOptions = {}): VerifyResult<T> {
    try {
      const payload = jwt.verify(token, this.secret, { ...this.verifyDefaults, ...options });

      if (typeof payload === "string") {
        return { ok: false, error: { kind: "invalid", message: "Token payload is a string." } };
      }

      return { ok: true, payload: payload as VerifiedToken<T> };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return { ok: false, error: { kind: "expired", message: err.message, expiredAt: err.expiredAt } };
      }
      if (err instanceof jwt.NotBeforeError) {
        return { ok: false, error: { kind: "notBefore", message: err.message, date: err.date } };
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return { ok: false, error: { kind: "invalid", message: err.message } };
      }
      return { ok: false, error: { kind: "unknown", message: "Unknown JWT verification error." } };
    }
  }

  verifyTokenOrThrow(token: string, options: VerifyOptions = {}): VerifiedToken<T> {
    const res = this.verifyToken(token, options);
    if (!res.ok) throw new Error(`JWT ${res.error.kind}: ${res.error.message}`);
    return res.payload;
  }

  decodeToken(token: string): (JwtPayload & Partial<T>) | null {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") return null;
    return decoded as JwtPayload & Partial<T>;
  }
}
