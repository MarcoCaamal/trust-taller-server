export type AppErrorCode =
  | "TENANT_SLUG_TAKEN"
  | "TENANT_DOMAIN_TAKEN"
  | "TENANT_EMAIL_TAKEN"
  | "USER_EMAIL_TAKEN"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "NOT_IMPLEMENTED"
  | "INTERNAL_ERROR";

export type AppError = {
  code: AppErrorCode;
  message: string;
  details?: unknown;
};
