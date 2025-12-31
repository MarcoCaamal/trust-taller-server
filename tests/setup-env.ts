import dotenv from "dotenv";

dotenv.config({ path: ".env.testing" });

process.env.BASE_DOMAIN = process.env.BASE_DOMAIN ?? "trust-taller.com";
process.env.PROBLEM_DOCS_BASE_URL =
  process.env.PROBLEM_DOCS_BASE_URL ?? "https://docs.trust-taller.com/errors";
process.env.DATABASE_URL_TEST =
  process.env.DATABASE_URL_TEST ??
  "postgresql://test_user:test_password@localhost:5433/trust_taller_test";
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";
