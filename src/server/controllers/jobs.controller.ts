import { Request, Response, NextFunction } from 'express';
import { jobRepository } from '../repositories/job.repository';
import { userRepository } from '../repositories/user.repository';
import { cvRepository } from '../repositories/cv.repository';
import { matchingRepository } from '../repositories/matching.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export async function getJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const search = (req.query.q as string || '').toLowerCase();
    const jobs = await jobRepository.getJobs(search);
    return sendSuccess(res, { total: jobs.length, jobs });
  } catch (err) {
    next(err);
  }
}

export async function searchJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const activeTarget = (await userRepository.getTargetPosition()) || {
      id: 'tgt_01',
      userId: 'usr_01',
      title: 'Full Stack AI Engineer',
      industry: 'Technology',
      expectedSalaryMin: 15000000,
      expectedSalaryMax: 28000000,
      currency: 'IDR',
      location: 'Jakarta / Remote',
      remotePreference: 'hybrid',
      experienceLevel: 'junior',
      updatedAt: new Date().toISOString(),
    };

    const activeCV = await cvRepository.getActiveCV();
    const cvSkills = activeCV ? activeCV.skills.hardSkills : ['React', 'Node.js', 'Python', 'SQL'];

    const freshJobs = await aiService.searchJobsWithSearchGrounding(activeTarget, cvSkills);
    await jobRepository.saveJobs(freshJobs);

    const matches = matchingRepository.recalculateMatches(activeCV, freshJobs);

    return sendSuccess(res, {
      status: 'success',
      count: freshJobs.length,
      foundCount: freshJobs.length,
      jobs: freshJobs,
      matches,
    });
  } catch (err) {
    next(err);
  }
}
