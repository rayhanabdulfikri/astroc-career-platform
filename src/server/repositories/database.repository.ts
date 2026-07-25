import { userRepository } from './user.repository';
import { cvRepository } from './cv.repository';
import { jobRepository } from './job.repository';
import { matchingRepository } from './matching.repository';
import { notificationRepository } from './notification.repository';
import { roadmapRepository } from './roadmap.repository';
import { logRepository } from './log.repository';
import { AuthUser, UserProfile, ParsedCV, CVAnalysisResult, TargetPosition, JobProcessed, JobMatch, CareerRoadmap, NotificationItem, AILog } from '../../types';

export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA.length || !vecB.length || vecA.length !== vecB.length) {
    return 0.75;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class AstrocRepository {
  public async getPrimaryUser(): Promise<AuthUser> {
    return userRepository.getPrimaryUser();
  }

  public async getProfile(userId: string): Promise<UserProfile | null> {
    return userRepository.getProfile(userId);
  }

  public async getActiveCV(): Promise<ParsedCV | null> {
    return cvRepository.getActiveCV();
  }

  public async getLatestAnalysis(cvId?: string): Promise<CVAnalysisResult | null> {
    return cvRepository.getLatestAnalysis(cvId);
  }

  public async saveCV(cv: ParsedCV): Promise<ParsedCV> {
    return cvRepository.saveCV(cv);
  }

  public async saveAnalysis(analysis: CVAnalysisResult): Promise<CVAnalysisResult> {
    return cvRepository.saveAnalysis(analysis);
  }

  public async getTargetPosition(userId?: string): Promise<TargetPosition | null> {
    return userRepository.getTargetPosition(userId);
  }

  public async updateTargetPosition(target: Partial<TargetPosition>): Promise<TargetPosition> {
    return userRepository.updateTargetPosition(target);
  }

  public async getJobs(search = ''): Promise<JobProcessed[]> {
    return jobRepository.getJobs(search);
  }

  public async saveJobs(jobs: JobProcessed[]): Promise<JobProcessed[]> {
    return jobRepository.saveJobs(jobs);
  }

  public async getMatches(): Promise<JobMatch[]> {
    return matchingRepository.getMatches();
  }

  public async recalculateMatches(cv: ParsedCV | null, jobs: JobProcessed[]): Promise<JobMatch[]> {
    return matchingRepository.recalculateMatches(cv, jobs);
  }

  public async getRoadmap(userId?: string): Promise<CareerRoadmap | null> {
    return roadmapRepository.getRoadmap(userId);
  }

  public async saveRoadmap(roadmap: CareerRoadmap): Promise<CareerRoadmap> {
    return roadmapRepository.saveRoadmap(roadmap);
  }

  public async getNotifications(userId?: string): Promise<NotificationItem[]> {
    return notificationRepository.getNotifications(userId);
  }

  public async addNotification(title: string, message: string, matchScore?: number, jobId?: string): Promise<NotificationItem> {
    return notificationRepository.addNotification(title, message, matchScore, jobId);
  }

  public async markNotificationsRead(userId?: string): Promise<void> {
    return notificationRepository.markAllRead(userId);
  }

  public async logAIAction(actionType: string, latencyMs: number, status: 'success' | 'error', details: string): Promise<AILog> {
    return logRepository.logAIAction(actionType, latencyMs, status, details);
  }

  public async getLogs(): Promise<AILog[]> {
    return logRepository.getLogs();
  }
}

export const dbRepository = new AstrocRepository();
