import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@core/database/prisma";
import config from "@core/config/app.config";
import { PERMISSIONS, PermissionCode } from "@core/auth/permissions";
import { createProblemDetails } from "@core/http/problem-details";

type AuthPayload = JwtPayload & {
  userId: number;
  tenantId: number;
};

const getBearerToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
};

export const authorize = (permission: PermissionCode) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getBearerToken(req);
      if (!token) {
        const problem = createProblemDetails({
          status: 401,
          title: "Unauthorized",
          detail: "Missing or invalid authorization header",
          type: `${config.problemDocsBaseUrl.replace(/\/$/, "")}/unauthorized`,
          instance: req.originalUrl,
        });
        return res.status(problem.status).type("application/problem+json").json(problem);
      }

      const payload = jwt.verify(token, config.jwtSecret);
      if (typeof payload === "string") {
        const problem = createProblemDetails({
          status: 401,
          title: "Unauthorized",
          detail: "Invalid token payload",
          type: `${config.problemDocsBaseUrl.replace(/\/$/, "")}/unauthorized`,
          instance: req.originalUrl,
        });
        return res.status(problem.status).type("application/problem+json").json(problem);
      }

      const { userId, tenantId } = payload as AuthPayload;
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
          tenantId,
          isActive: true,
          tenant: { isActive: true },
        },
        select: { id: true },
      });

      if (!user) {
        const problem = createProblemDetails({
          status: 401,
          title: "Unauthorized",
          detail: "Invalid credentials",
          type: `${config.problemDocsBaseUrl.replace(/\/$/, "")}/unauthorized`,
          instance: req.originalUrl,
        });
        return res.status(problem.status).type("application/problem+json").json(problem);
      }

      const permissionCheck = await prisma.userRole.findFirst({
        where: {
          userId,
          role: {
            OR: [{ tenantId: null }, { tenantId }],
            rolePermissions: {
              some: {
                permission: {
                  code: { in: [PERMISSIONS.SYSTEM_ROOT, permission] },
                },
              },
            },
          },
        },
        select: { id: true },
      });

      if (!permissionCheck) {
        const problem = createProblemDetails({
          status: 403,
          title: "Forbidden",
          detail: "Missing required permission",
          type: `${config.problemDocsBaseUrl.replace(/\/$/, "")}/forbidden`,
          instance: req.originalUrl,
        });
        return res.status(problem.status).type("application/problem+json").json(problem);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
