import request from "supertest";
import { describe, it, expect, jest } from "@jest/globals";

const loadApp = async () => {
  jest.resetModules();
  const { default: app } = await import("../../src/app");
  return app;
};

const setEnv = (overrides: Record<string, string | undefined>) => {
  process.env.NODE_ENV = overrides.NODE_ENV ?? process.env.NODE_ENV ?? "test";
  process.env.BASE_DOMAIN = overrides.BASE_DOMAIN ?? "trust-taller.com";
  process.env.CORS_ORIGINS = overrides.CORS_ORIGINS;
};

describe("CORS allowlist", () => {
  it("allows subdomain origin from base domain", async () => {
    setEnv({ NODE_ENV: "production", BASE_DOMAIN: "trust-taller.com", CORS_ORIGINS: "" });
    const app = await loadApp();

    const response = await request(app)
      .get("/health")
      .set("Origin", "https://taller1.trust-taller.com");

    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://taller1.trust-taller.com"
    );
  });

  it("allows explicit origins from CORS_ORIGINS", async () => {
    setEnv({
      NODE_ENV: "production",
      BASE_DOMAIN: "trust-taller.com",
      CORS_ORIGINS: "https://allowed.example.com",
    });
    const app = await loadApp();

    const response = await request(app)
      .get("/health")
      .set("Origin", "https://allowed.example.com");

    expect(response.headers["access-control-allow-origin"]).toBe("https://allowed.example.com");
  });

  it("rejects origin outside allowlist", async () => {
    setEnv({ NODE_ENV: "production", BASE_DOMAIN: "trust-taller.com", CORS_ORIGINS: "" });
    const app = await loadApp();

    const response = await request(app)
      .get("/health")
      .set("Origin", "https://evil.com");

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("allows localhost in non-production", async () => {
    setEnv({ NODE_ENV: "development", BASE_DOMAIN: "trust-taller.com", CORS_ORIGINS: "" });
    const app = await loadApp();

    const response = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:5173");

    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  it("rejects localhost in production", async () => {
    setEnv({ NODE_ENV: "production", BASE_DOMAIN: "trust-taller.com", CORS_ORIGINS: "" });
    const app = await loadApp();

    const response = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:5173");

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});

describe("Auth rate limiting", () => {
  it("allows requests until the limit is reached", async () => {
    setEnv({ NODE_ENV: "test", BASE_DOMAIN: "trust-taller.com", CORS_ORIGINS: "" });
    const app = await loadApp();

    for (let i = 0; i < 20; i += 1) {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
    }
  });

  it("blocks requests after the limit is exceeded", async () => {
    setEnv({ NODE_ENV: "test", BASE_DOMAIN: "trust-taller.com", CORS_ORIGINS: "" });
    const app = await loadApp();

    for (let i = 0; i < 20; i += 1) {
      await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });
    }

    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(429);
    expect(response.headers["content-type"]).toContain("application/problem+json");
    expect(response.body.status).toBe(429);
    expect(response.body.retryAfterSeconds).toBeDefined();
  });
});
