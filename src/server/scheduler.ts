import { db } from './db';
import { searchJobsWithSearchGrounding } from './gemini';

export class JobSearchScheduler {
  private timer: NodeJS.Timeout | null = null;
  public isRunning = false;
  public lastRunTime: string | null = null;
  public runCount = 0;

  public startScheduler() {
    if (this.timer) return;
    console.log('⏰ ASTROC Job Discovery Scheduler initialized (6-hour interval active)');
    
    // Initial background run after 10 seconds of server boot
    setTimeout(() => {
      this.executeJobSearchPipeline();
    }, 10000);

    // Set 6-hour interval
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
      const primaryTarget = db.targetPositions[0] || {
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

      const primaryCV = db.cvs[0];
      const cvSkills = primaryCV ? primaryCV.skills.hardSkills : ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'];

      // Fetch fresh jobs with Search Grounding
      const freshJobs = await searchJobsWithSearchGrounding(primaryTarget, cvSkills);

      // Re-calculate matches
      db.calculateInitialMatches();

      // Check for High Match (>85%) and trigger notifications
      let highMatchCount = 0;
      db.jobMatches.forEach((m) => {
        if (m.overallMatchScore >= 85) {
          highMatchCount++;
          // check if notification already exists for this job
          const existingNotif = db.notifications.find((n) => n.jobId === m.jobId);
          if (!existingNotif) {
            db.addNotification(
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

      db.logAIAction(
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
      db.logAIAction('SCHEDULER_CRON', 1000, 'error', err?.message || 'Error');
      return { jobsFound: 0, highMatchCount: 0 };
    }
  }
}

export const jobScheduler = new JobSearchScheduler();
