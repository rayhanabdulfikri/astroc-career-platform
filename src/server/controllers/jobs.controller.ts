import { Request, Response, NextFunction } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export function getJobs(req: Request, res: Response) {
  const search = (req.query.q as string || '').toLowerCase();
  let jobs = dbRepository.jobsProcessed;
  if (search) {
    jobs = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(search) ||
        j.company.toLowerCase().includes(search) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(search))
    );
  }
  return sendSuccess(res, { total: jobs.length, jobs });
}

export async function searchJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const activeTarget = dbRepository.targetPositions[0];
    const activeCV = dbRepository.cvs[0];
    const cvSkills = activeCV ? activeCV.skills.hardSkills : ['React', 'Node.js', 'Python', 'SQL'];

    const freshJobs = await aiService.searchJobsWithSearchGrounding(activeTarget, cvSkills);
    dbRepository.calculateInitialMatches();

    return sendSuccess(res, {
      status: 'success',
      count: freshJobs.length,
      foundCount: freshJobs.length,
      jobs: freshJobs,
      matches: dbRepository.jobMatches,
    });
  } catch (err) {
    next(err);
  }
}
