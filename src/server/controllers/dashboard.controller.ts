import { Request, Response } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { sendSuccess } from '../utils/response';

export function getDashboard(req: Request, res: Response) {
  const activeCV = dbRepository.cvs[0] || null;
  const latestAnalysis = dbRepository.cvAnalysis.find((a) => a.cvId === activeCV?.id) || dbRepository.cvAnalysis[0] || null;

  const dashboardPayload = {
    user: dbRepository.users[0],
    targetPosition: dbRepository.targetPositions[0] || null,
    activeCV,
    latestAnalysis,
    overallCareerScore: latestAnalysis ? latestAnalysis.overallCareerScore : 90,
    atsScore: latestAnalysis ? latestAnalysis.ats.atsScore : 92,
    hrScore: latestAnalysis ? latestAnalysis.hr.hrScore : 88,
    cvCount: dbRepository.cvs.length,
    matchesCount: dbRepository.jobMatches.length,
    totalJobsInDatabase: dbRepository.jobsProcessed.length,
    topMatchingJobs: dbRepository.jobMatches.slice(0, 5),
    interviewReadiness: 88,
    notificationsCount: dbRepository.notifications.filter((n) => !n.isRead).length,
  };

  return sendSuccess(res, {
    data: dashboardPayload,
    ...dashboardPayload,
  });
}
