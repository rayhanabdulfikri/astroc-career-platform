import { jobScheduler } from '../services/scheduler.service';
import { userRepository } from '../repositories/user.repository';
import { jobRepository } from '../repositories/job.repository';
import { cvRepository } from '../repositories/cv.repository';

export async function runSelfTestSuite(): Promise<{ success: boolean; results: string[] }> {
  const results: string[] = [];
  try {
    // 1. Health Status Test
    const health = await jobScheduler.getHealthStatus();
    results.push(`[PASS] System Health check returned status: ${health.status}`);

    // 2. User Repository Test
    const user = await userRepository.getPrimaryUser();
    results.push(`[PASS] Primary User loaded: ${user.fullName} (${user.email})`);

    // 3. Job Repository Test
    const jobs = await jobRepository.getJobs();
    results.push(`[PASS] Job Repository returned ${jobs.length} jobs`);

    // 4. CV Repository Test
    const cv = await cvRepository.getActiveCV();
    results.push(`[PASS] Active CV loaded: ${cv?.name || 'Default'}`);

    return { success: true, results };
  } catch (err: any) {
    results.push(`[FAIL] Test error: ${err.message}`);
    return { success: false, results };
  }
}
