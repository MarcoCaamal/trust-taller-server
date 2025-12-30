import { Request, Response, NextFunction } from 'express';
import { AuthServiceInterface } from './services/interfaces/auth.service.interface';
import { problemDetailsFromAppError } from '@core/http/problem-details';

export class AuthController {

  constructor(private authService: AuthServiceInterface) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
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
      const result = await this.authService.registerWorkshop(req.body);
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
