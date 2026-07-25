import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function validateBody(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = requiredFields.filter((field) => req.body[field] === undefined || req.body[field] === null);
    if (missing.length > 0) {
      return sendError(res, `Missing required body parameters: ${missing.join(', ')}`, 400);
    }
    next();
  };
}
