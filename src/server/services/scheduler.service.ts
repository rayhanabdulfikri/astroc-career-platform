import { userRepository } from '../repositories/user.repository';
import { cvRepository } from '../repositories/cv.repository';
import { matchingRepository } from '../repositories/matching.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { logRepository } from '../repositories/log.repository';
import { getSupabaseClient } from '../config/supabase';
import { aiService } from './ai.service';

export class JobSearchScheduler {
  private timer: NodeJS.Timeout | null = null;
  public isRunning = false;
  public lastRunTime: string | null = null;
  public nextScheduledRun: string | null = null;
  public runCount = 0;
  public failedRetriesCount = 0;

  public startScheduler() {
    if (this.timer) return;
    console.log('⏰ ASTROC Production Job Discovery Scheduler initialized (6-hour interval active)');

    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
    this.nextScheduledRun = new Date(Date.now() + SIX_HOURS_MS).toISOString();

    // Warmup execution after 10 seconds
    setTimeout(() => {
      this.executeJobSearchPipeline();
    }, 10000);

    this.timer = setInterval(() => {
      this.executeJobSearchPipeline();
      this.nextScheduledRun = new Date(Date.now() + SIX_HOURS_MS).toISOString();
    }, SIX_HOURS_MS);
  }

  public async executeJobSearchPipeline(maxRetries = 3): Promise<{
    success: boolean;
    jobsFound: number;
    highMatchCount: number;
    retriesUsed: number;
  }> {
    if (this.isRunning) {
      return { success: true, jobsFound: 0, highMatchCount: 0, retriesUsed: 0 };
    }

    this.isRunning = true;
    const startTime = Date.now();
    let retriesUsed = 0;
    let success = false;
    let freshJobs: any[] = [];
    let highMatchCount = 0;

    console.log('🔍 Executing Automated Job Discovery Pipeline (Search -> Normalize -> Deduplicate -> Embed -> Persist)...');

    while (retriesUsed < maxRetries && !success) {
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

        // 1. Search Grounding & Normalization & Embedding Generation
        freshJobs = await aiService.searchJobsWithSearchGrounding(primaryTarget, cvSkills);

        // 2. Semantic Matching & Notifications Trigger
        const matches = matchingRepository.recalculateMatches(primaryCV, freshJobs);
        const notifications = await notificationRepository.getNotifications();

        matches.forEach((m) => {
          if (m.overallMatchScore >= 85) {
            highMatchCount++;
            const existingNotif = notifications.find((n) => n.jobId === m.jobId);
            if (!existingNotif) {
              notificationRepository.addNotification(
                `High Match Job Found! (${m.overallMatchScore}%)`,
                `Lowongan "${m.job.title}" di ${m.job.company} cocok ${m.overallMatchScore}% dengan profil CV Anda!`,
                m.overallMatchScore,
                m.jobId
              );
            }
          }
        });

        success = true;
      } catch (err: any) {
        retriesUsed++;
        this.failedRetriesCount++;
        console.warn(`⚠️ Scheduler pipeline attempt ${retriesUsed} failed: ${err?.message || 'Error'}. Retrying...`);
        if (retriesUsed < maxRetries) {
          await new Promise((res) => setTimeout(res, 2000 * retriesUsed));
        }
      }
    }

    const latency = Date.now() - startTime;
    this.lastRunTime = new Date().toISOString();
    this.runCount++;
    this.isRunning = false;

    await logRepository.logAIAction(
      'SCHEDULER_CRON',
      latency,
      success ? 'success' : 'error',
      `Pipeline completed. Found ${freshJobs.length} jobs, ${highMatchCount} high matches. Retries used: ${retriesUsed}.`
    );

    return {
      success,
      jobsFound: freshJobs.length,
      highMatchCount,
      retriesUsed,
    };
  }

  public async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    uptimeSeconds: number;
    memoryUsageMB: number;
    databaseConnected: boolean;
    scheduler: {
      isRunning: boolean;
      lastRunTime: string | null;
      nextScheduledRun: string | null;
      runCount: number;
      failedRetriesCount: number;
    };
  }> {
    let databaseConnected = false;
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('id').limit(1);
        if (!error) databaseConnected = true;
      } catch (err) {
        databaseConnected = false;
      }
    } else {
      databaseConnected = true; // Local memory fallback active
    }

    const memoryUsageMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

    return {
      status: databaseConnected ? 'healthy' : 'degraded',
      uptimeSeconds: Math.round(process.uptime()),
      memoryUsageMB,
      databaseConnected,
      scheduler: {
        isRunning: this.isRunning,
        lastRunTime: this.lastRunTime,
        nextScheduledRun: this.nextScheduledRun,
        runCount: this.runCount,
        failedRetriesCount: this.failedRetriesCount,
      },
    };
  }
}

export const jobScheduler = new JobSearchScheduler();
