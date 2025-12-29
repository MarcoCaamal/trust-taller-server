import { JwtPayload, Secret, SignOptions, VerifyOptions } from "jsonwebtoken";

export type VerifiedToken<T extends object> = JwtPayload & T;

export type JwtVerifyError =
  | { kind: "expired"; message: string; expiredAt: Date }
  | { kind: "notBefore"; message: string; date: Date }
  | { kind: "invalid"; message: string }
  | { kind: "unknown"; message: string };

export type VerifyResult<T extends object> =
  | { ok: true; payload: VerifiedToken<T> }
  | { ok: false; error: JwtVerifyError };

export type JwtServiceConfig = {
  secret: Secret;
  signDefaults?: SignOptions;
  verifyDefaults?: VerifyOptions;
};
