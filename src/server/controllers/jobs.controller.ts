import { Request, Response, NextFunction } from 'express';
import { jobRepository } from '../repositories/job.repository';
import { userRepository } from '../repositories/user.repository';
import { cvRepository } from '../repositories/cv.repository';
import { matchingRepository } from '../repositories/matching.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export async function getJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, location, employmentType, experienceLevel, minSalary, page, limit } = req.query;

    const result = await jobRepository.getJobsPaginated({
      q: q as string,
      location: location as string,
      employmentType: employmentType as string,
      experienceLevel: experienceLevel as string,
      minSalary: minSalary ? Number(minSalary) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    return sendSuccess(res, {
      jobs: result.jobs,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
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
