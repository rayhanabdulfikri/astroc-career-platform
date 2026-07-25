import { userRepository } from '../repositories/user.repository';
import { cvRepository } from '../repositories/cv.repository';
import { matchingRepository } from '../repositories/matching.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { logRepository } from '../repositories/log.repository';
import { aiService } from './ai.service';

export class JobSearchScheduler {
  private timer: NodeJS.Timeout | null = null;
  public isRunning = false;
  public lastRunTime: string | null = null;
  public runCount = 0;

  public startScheduler() {
    if (this.timer) return;
    console.log('⏰ ASTROC Job Discovery Scheduler initialized (6-hour interval active)');

    setTimeout(() => {
      this.executeJobSearchPipeline();
    }, 10000);

    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
    this.timer = setInterval(() => {
      this.executeJobSearchPipeline();
    }, SIX_HOURS_MS);
  }

  public async executeJobSearchPipeline(): Promise<{
    jobsFound: number;
    highMatchCount: number;
  }> {
    if (this.isRunning) {
      return { jobsFound: 0, highMatchCount: 0 };
    }

    this.isRunning = true;
    console.log('🔍 Running ASTROC Job Search & Normalization Pipeline via Gemini Search Grounding...');

    try {
      const primaryTarget = (await userRepository.getTargetPosition()) || {
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

      const primaryCV = await cvRepository.getActiveCV();
      const cvSkills = primaryCV ? primaryCV.skills.hardSkills : ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'];

      const freshJobs = await aiService.searchJobsWithSearchGrounding(primaryTarget, cvSkills);
      const matches = matchingRepository.recalculateMatches(primaryCV, freshJobs);

      let highMatchCount = 0;
      const notifications = await notificationRepository.getNotifications();

      matches.forEach((m) => {
        if (m.overallMatchScore >= 85) {
          highMatchCount++;
          const existingNotif = notifications.find((n) => n.jobId === m.jobId);
          if (!existingNotif) {
            notificationRepository.addNotification(
              `High Career Match Found! (${m.overallMatchScore}%)`,
              `Lowongan "${m.job.title}" di ${m.job.company} cocok ${m.overallMatchScore}% dengan kualifikasi CV Anda!`,
              m.overallMatchScore,
              m.jobId
            );
          }
        }
      });

      this.lastRunTime = new Date().toISOString();
      this.runCount++;
      this.isRunning = false;

      await logRepository.logAIAction(
        'SCHEDULER_CRON',
        1500,
        'success',
        `Job Search Pipeline completed. Found ${freshJobs.length} jobs, ${highMatchCount} high-match triggers.`
      );

      return {
        jobsFound: freshJobs.length,
        highMatchCount,
      };
    } catch (err: any) {
      this.isRunning = false;
      console.error('Scheduler error:', err);
      await logRepository.logAIAction('SCHEDULER_CRON', 1000, 'error', err?.message || 'Error');
      return { jobsFound: 0, highMatchCount: 0 };
    }
  }
}

export const jobScheduler = new JobSearchScheduler();
