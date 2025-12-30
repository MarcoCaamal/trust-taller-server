import { Request, Response, NextFunction } from 'express';
import { AuthServiceInterface } from './services/interfaces/auth.service.interface';
import { problemDetailsFromAppError } from '@core/http/problem-details';
import { getTenantDomainFromHost } from '@core/http/tenant-domain';
import config from '@core/config/app.config';

export class AuthController {

  constructor(private authService: AuthServiceInterface) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawHost = (req.headers['x-forwarded-host'] ?? req.headers.host) as string | undefined;
      const domain = getTenantDomainFromHost(rawHost);
      if (!domain) {
        const problem = problemDetailsFromAppError(
          {
            code: 'VALIDATION_ERROR',
            message: 'Tenant domain is required',
          },
          req.originalUrl
        );
        res.status(problem.status).type('application/problem+json').json(problem);
        return;
      }

      const result = await this.authService.login({ ...req.body, domain });
      if (result.ok) {
        res.status(200).json({
          success: true,
          data: result.value,
        });
        return;
      }

      const problem = problemDetailsFromAppError(result.error, req.originalUrl);
      res.status(problem.status).type('application/problem+json').json(problem);
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const domain = `${req.body.slug}.${config.baseDomain}`.toLowerCase();
      const result = await this.authService.registerWorkshop({ ...req.body, domain });
      if (result.ok) {
        res.status(201).json({
          success: true,
          data: result.value,
        });
        return;
      }

      const problem = problemDetailsFromAppError(result.error, req.originalUrl);
      res.status(problem.status).type('application/problem+json').json(problem);
    } catch (error) {
      next(error);
    }
  }
}
