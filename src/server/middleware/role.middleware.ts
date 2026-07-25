import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { sendError } from '../utils/response';

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized: User authentication required', 401);
    }

    const userRole = req.user.role || 'job_seeker';
    if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
      return sendError(res, `Forbidden: Insufficient permissions. Required: ${allowedRoles.join(', ')}`, 403);
    }

    next();
  };
}
