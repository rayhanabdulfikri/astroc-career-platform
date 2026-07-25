import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export function getHealthStatus(req: Request, res: Response) {
  return sendSuccess(res, {
    status: 'ok',
    service: 'ASTROC – AI Career Intelligence Platform',
    version: '1.0.0-production',
    aiModel: 'gemini-3.6-flash',
    groundingEnabled: true,
    timestamp: new Date().toISOString(),
  });
}
