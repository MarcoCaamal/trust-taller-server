import "dotenv/config";
import { z } from "zod";
import { AppConfig } from "@core/types";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  BASE_DOMAIN: z.string().min(1, "BASE_DOMAIN is required"),
  PROBLEM_DOCS_BASE_URL: z.string().min(1, "PROBLEM_DOCS_BASE_URL is required"),
});

const env = envSchema.parse(process.env);

const config: AppConfig = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  baseDomain: env.BASE_DOMAIN,
  problemDocsBaseUrl: env.PROBLEM_DOCS_BASE_URL,
};

export default config;
