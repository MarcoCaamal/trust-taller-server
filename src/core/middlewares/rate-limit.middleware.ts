import type { Request, RequestHandler } from "express";
import config from "@core/config/app.config";
import { createProblemDetails } from "@core/http/problem-details";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const defaultKeyGenerator = (req: Request): string => req.ip ?? "unknown";

export const rateLimit = (options: RateLimitOptions): RequestHandler => {
  const windowMs = options.windowMs;
  const max = options.max;
  const keyGenerator = options.keyGenerator ?? defaultKeyGenerator;
  const store = new Map<string, RateLimitEntry>();

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.setHeader("Retry-After", String(retryAfter));

      const problem = createProblemDetails({
        status: 429,
        title: "Too Many Requests",
        detail: "Rate limit exceeded",
        type: `${config.problemDocsBaseUrl.replace(/\/$/, "")}/rate-limit`,
        instance: req.originalUrl,
        extensions: {
          limit: max,
          windowMs,
          retryAfterSeconds: retryAfter,
        },
      });
      return res.status(problem.status).type("application/problem+json").json(problem);
    }

    entry.count += 1;
    store.set(key, entry);
    return next();
  };
};
