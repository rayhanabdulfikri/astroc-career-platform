import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Endpoint non-existent: ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`❌ [SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = typeof err?.statusCode === 'number' ? err.statusCode : 500;
  const message = err?.message || err?.toString() || 'Internal Server Error';

  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    errorName: err?.name || 'Error',
    stack: err?.stack || undefined,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
}
