import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@core/exceptions/http.exception';
import { ZodError } from 'zod';
import { createProblemDetails, titleFromStatus } from '@core/http/problem-details';
import config from '@core/config/app.config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    const problem = createProblemDetails({
      status: 400,
      title: titleFromStatus(400),
      detail: 'Validation error',
      type: `${config.problemDocsBaseUrl.replace(/\/$/, '')}/validation-error`,
      instance: req.originalUrl,
      extensions: {
        errors: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
    return res.status(problem.status).type('application/problem+json').json(problem);
  }

  // Custom HTTP exceptions
  if (err instanceof HttpException) {
    const problem = createProblemDetails({
      status: err.statusCode,
      title: titleFromStatus(err.statusCode),
      detail: err.message,
      instance: req.originalUrl,
    });
    return res.status(problem.status).type('application/problem+json').json(problem);
  }

  // Generic errors
  console.error('Unhandled error:', err);
  const problem = createProblemDetails({
    status: 500,
    title: titleFromStatus(500),
    detail: err.message || 'Internal server error',
    instance: req.originalUrl,
  });
  return res.status(problem.status).type('application/problem+json').json(problem);
};
