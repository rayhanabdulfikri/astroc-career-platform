import { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repositories/user.repository';
import { cvRepository } from '../repositories/cv.repository';
import { jobRepository } from '../repositories/job.repository';
import { matchingRepository } from '../repositories/matching.repository';
import { sendSuccess } from '../utils/response';

export async function getTargetPosition(req: Request, res: Response, next: NextFunction) {
  try {
    const targetPosition = await userRepository.getTargetPosition();
    return sendSuccess(res, { targetPosition });
  } catch (err) {
    next(err);
  }
}

export async function updateTargetPosition(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, industry, expectedSalaryMin, expectedSalaryMax, location, remotePreference, experienceLevel } = req.body;

    const currentTarget = await userRepository.getTargetPosition();

    const updated = await userRepository.updateTargetPosition({
      id: currentTarget?.id || 'tgt_01',
      userId: 'usr_01',
      title: title || 'Full Stack AI Engineer',
      industry: industry || 'Technology',
      expectedSalaryMin: Number(expectedSalaryMin) || 15000000,
      expectedSalaryMax: Number(expectedSalaryMax) || 28000000,
      currency: 'IDR',
      location: location || 'Jakarta / Remote',
      remotePreference: remotePreference || 'hybrid',
      experienceLevel: experienceLevel || 'junior',
    });

    const activeCV = await cvRepository.getActiveCV();
    const jobs = await jobRepository.getJobs();
    matchingRepository.recalculateMatches(activeCV, jobs);

    return sendSuccess(res, { status: 'success', targetPosition: updated });
  } catch (err) {
    next(err);
  }
}
