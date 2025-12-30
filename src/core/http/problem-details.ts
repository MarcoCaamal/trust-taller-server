import { AppError } from "@core/types/app-error";
import config from "@core/config/app.config";

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
};

const PROBLEM_BASE = config.problemDocsBaseUrl.replace(/\/$/, "");

const statusTitleMap: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
  501: "Not Implemented",
};

export const titleFromStatus = (status: number): string =>
  statusTitleMap[status] ?? "Unexpected Error";

export const createProblemDetails = (input: {
  status: number;
  title?: string;
  detail?: string;
  type?: string;
  instance?: string;
  extensions?: Record<string, unknown>;
}): ProblemDetails => {
  const problem: ProblemDetails = {
    type: input.type ?? "about:blank",
    title: input.title ?? titleFromStatus(input.status),
    status: input.status,
  };

  if (input.detail) problem.detail = input.detail;
  if (input.instance) problem.instance = input.instance;
  if (input.extensions) Object.assign(problem, input.extensions);

  return problem;
};

export const problemDetailsFromAppError = (
  error: AppError,
  instance?: string
): ProblemDetails => {
  const mapping: Record<AppError["code"], { status: number; type: string }> = {
    TENANT_SLUG_TAKEN: { status: 409, type: `${PROBLEM_BASE}/tenant-slug-taken` },
    TENANT_DOMAIN_TAKEN: { status: 409, type: `${PROBLEM_BASE}/tenant-domain-taken` },
    TENANT_EMAIL_TAKEN: { status: 409, type: `${PROBLEM_BASE}/tenant-email-taken` },
    USER_EMAIL_TAKEN: { status: 409, type: `${PROBLEM_BASE}/user-email-taken` },
    VALIDATION_ERROR: { status: 400, type: `${PROBLEM_BASE}/validation-error` },
    UNAUTHORIZED: { status: 401, type: `${PROBLEM_BASE}/unauthorized` },
    FORBIDDEN: { status: 403, type: `${PROBLEM_BASE}/forbidden` },
    NOT_FOUND: { status: 404, type: `${PROBLEM_BASE}/not-found` },
    CONFLICT: { status: 409, type: `${PROBLEM_BASE}/conflict` },
    UNPROCESSABLE_ENTITY: { status: 422, type: `${PROBLEM_BASE}/unprocessable-entity` },
    NOT_IMPLEMENTED: { status: 501, type: `${PROBLEM_BASE}/not-implemented` },
    INTERNAL_ERROR: { status: 500, type: `${PROBLEM_BASE}/internal-error` },
  };

  const mapped = mapping[error.code] ?? {
    status: 500,
    type: `${PROBLEM_BASE}/internal-error`,
  };

  return createProblemDetails({
    status: mapped.status,
    title: titleFromStatus(mapped.status),
    detail: error.message,
    type: mapped.type,
    instance,
    extensions: error.details ? { details: error.details } : undefined,
  });
};
