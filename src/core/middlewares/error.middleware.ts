import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@core/exceptions/http.exception';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Custom HTTP exceptions
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Generic errors
  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};
