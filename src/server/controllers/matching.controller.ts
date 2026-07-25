import { Request, Response, NextFunction } from 'express';
import { matchingRepository } from '../repositories/matching.repository';
import { cvRepository } from '../repositories/cv.repository';
import { jobRepository } from '../repositories/job.repository';
import { sendSuccess } from '../utils/response';

export async function getMatching(req: Request, res: Response, next: NextFunction) {
  try {
    const matches = await matchingRepository.getMatches();
    return sendSuccess(res, {
      matches,
      topMatch: matches[0] || null,
    });
  } catch (err) {
    next(err);
  }
}

export async function calculateMatching(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const jobs = await jobRepository.getJobs();
    const matches = matchingRepository.recalculateMatches(activeCV, jobs);
    return sendSuccess(res, { status: 'success', matches });
  } catch (err) {
    next(err);
  }
}
