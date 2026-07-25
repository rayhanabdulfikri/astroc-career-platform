import { Response } from 'express';

export function sendSuccess(res: Response, payload: any = {}, statusCode = 200) {
  if (typeof payload === 'object' && payload !== null && !Array.isArray(payload)) {
    return res.status(statusCode).json({
      success: true,
      ...payload,
    });
  }
  return res.status(statusCode).json({
    success: true,
    data: payload,
  });
}

export function sendError(res: Response, message: string, statusCode = 500, details: any = null) {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(details ? { details } : {}),
    timestamp: new Date().toISOString(),
  });
}
