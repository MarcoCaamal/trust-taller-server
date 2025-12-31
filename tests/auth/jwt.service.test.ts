import { describe, it, expect } from "@jest/globals";
import { JwtService } from "../../src/modules/auth/services/jwt.service";

describe("JwtService", () => {
  it("generates and verifies a token", () => {
    const service = new JwtService({ secret: "test-secret" });
    const token = service.generateToken({ userId: 1, tenantId: 2 });
    const result = service.verifyToken(token);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload.userId).toBe(1);
      expect(result.payload.tenantId).toBe(2);
    }
  });

  it("decodes token payload", () => {
    const service = new JwtService({ secret: "test-secret" });
    const token = service.generateToken({ userId: 1, tenantId: 2 });
    const payload = service.decodeToken(token);

    expect(payload?.userId).toBe(1);
    expect(payload?.tenantId).toBe(2);
  });
});
