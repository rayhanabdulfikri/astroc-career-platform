import { Request, Response, NextFunction } from 'express';
import { jobScheduler } from '../services/scheduler.service';
import { sendSuccess } from '../utils/response';

export async function getHealth(req: Request, res: Response, next: NextFunction) {
  try {
    const healthStatus = await jobScheduler.getHealthStatus();
    return sendSuccess(res, {
      status: healthStatus.status,
      timestamp: new Date().toISOString(),
      service: 'ASTROC AI Platform Core API',
      version: '2.5.0-production',
      ...healthStatus,
    });
  } catch (err) {
    next(err);
  }
}

export const getHealthStatus = getHealth;
