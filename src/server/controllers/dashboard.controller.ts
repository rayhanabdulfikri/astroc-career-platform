import { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repositories/user.repository';
import { cvRepository } from '../repositories/cv.repository';
import { jobRepository } from '../repositories/job.repository';
import { matchingRepository } from '../repositories/matching.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { sendSuccess } from '../utils/response';

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userRepository.getPrimaryUser();
    const targetPosition = await userRepository.getTargetPosition(user.id);
    const activeCV = await cvRepository.getActiveCV();
    const latestAnalysis = await cvRepository.getLatestAnalysis(activeCV?.id);
    const cvs = cvRepository.getAllCVs();
    const jobs = await jobRepository.getJobs();
    const matches = await matchingRepository.getMatches();
    const notifications = await notificationRepository.getNotifications(user.id);

    const dashboardPayload = {
      user,
      targetPosition,
      activeCV,
      latestAnalysis,
      overallCareerScore: latestAnalysis ? latestAnalysis.overallCareerScore : 90,
      atsScore: latestAnalysis ? latestAnalysis.ats.atsScore : 92,
      hrScore: latestAnalysis ? latestAnalysis.hr.hrScore : 88,
      cvCount: cvs.length,
      matchesCount: matches.length,
      totalJobsInDatabase: jobs.length,
      topMatchingJobs: matches.slice(0, 5),
      interviewReadiness: 88,
      notificationsCount: notifications.filter((n) => !n.isRead).length,
    };

    return sendSuccess(res, {
      data: dashboardPayload,
      ...dashboardPayload,
    });
  } catch (err) {
    next(err);
  }
}
