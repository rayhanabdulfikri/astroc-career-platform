import { Request, Response, NextFunction } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { jobScheduler } from '../services/scheduler.service';
import { sendSuccess } from '../utils/response';

export async function triggerScheduler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await jobScheduler.executeJobSearchPipeline();
    return sendSuccess(res, {
      status: 'success',
      discoveredJobsCount: result.jobsFound,
      schedulerState: {
        isRunning: jobScheduler.isRunning,
        lastRunTime: jobScheduler.lastRunTime,
        runCount: jobScheduler.runCount,
      },
      result,
    });
  } catch (err) {
    next(err);
  }
}

export function getLogs(req: Request, res: Response) {
  return sendSuccess(res, {
    logs: dbRepository.aiLogs,
    scheduler: {
      isRunning: jobScheduler.isRunning,
      lastRunTime: jobScheduler.lastRunTime,
      runCount: jobScheduler.runCount,
    },
  });
}
