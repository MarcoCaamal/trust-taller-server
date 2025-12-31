import { execSync } from "node:child_process";
import dotenv from "dotenv";

const ensureEnv = () => {
  dotenv.config({ path: ".env.testing" });
  process.env.DATABASE_URL_TEST =
    process.env.DATABASE_URL_TEST ??
    "postgresql://test_user:test_password@localhost:5433/trust_taller_test";
  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";
  process.env.BASE_DOMAIN = process.env.BASE_DOMAIN ?? "trust-taller.com";
  process.env.PROBLEM_DOCS_BASE_URL =
    process.env.PROBLEM_DOCS_BASE_URL ?? "https://docs.trust-taller.com/errors";
};

const waitForPostgres = async () => {
  const maxAttempts = 15;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      execSync(
        "docker compose -f docker-compose.test.yml exec -T postgres-test pg_isready -U test_user -d trust_taller_test",
        { stdio: "ignore" }
      );
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Postgres test container is not ready");
};

export default async () => {
  ensureEnv();
  execSync("docker compose -f docker-compose.test.yml up -d", {
    stdio: "inherit",
  });
  await waitForPostgres();
  execSync("npx prisma generate", {
    stdio: "inherit",
  });
  execSync("npx prisma db push", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL_TEST,
    },
  });
};
