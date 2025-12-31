import "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: number;
        tenantId: number;
      };
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: number;
      tenantId: number;
    };
  }
}

export {};
