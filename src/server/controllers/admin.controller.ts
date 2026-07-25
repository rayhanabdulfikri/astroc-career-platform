import { Request, Response, NextFunction } from 'express';
import { logRepository } from '../repositories/log.repository';
import { jobScheduler } from '../services/scheduler.service';
import { sendSuccess } from '../utils/response';

export async function triggerScheduler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await jobScheduler.executeJobSearchPipeline();
    return sendSuccess(res, {
      status: 'success',
      discoveredJobsCount: result.jobsFound,
      highMatchCount: result.highMatchCount,
      retriesUsed: result.retriesUsed,
      schedulerState: {
        isRunning: jobScheduler.isRunning,
        lastRunTime: jobScheduler.lastRunTime,
        nextScheduledRun: jobScheduler.nextScheduledRun,
        runCount: jobScheduler.runCount,
        failedRetriesCount: jobScheduler.failedRetriesCount,
      },
      result,
    });
  } catch (err) {
    next(err);
  }
}

export async function getLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await logRepository.getLogs();
    return sendSuccess(res, {
      logs,
      scheduler: {
        isRunning: jobScheduler.isRunning,
        lastRunTime: jobScheduler.lastRunTime,
        nextScheduledRun: jobScheduler.nextScheduledRun,
        runCount: jobScheduler.runCount,
        failedRetriesCount: jobScheduler.failedRetriesCount,
      },
    });
  } catch (err) {
    next(err);
  }
}
