import {
  AuthUser,
  UserProfile,
  ParsedCV,
  CVAnalysisResult,
  TargetPosition,
  JobProcessed,
  JobMatch,
  SkillGapAnalysis,
  CareerRoadmap,
  InterviewQuestion,
  NotificationItem,
  AILog,
} from '../types';
import { sampleUser, sampleCVs, sampleTargetPosition, sampleJobs } from '../data/sampleData';

// Simulated Vector Similarity Calculator (pgvector representation)
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA.length || !vecB.length || vecA.length !== vecB.length) {
    // Fallback based on text set overlap
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

// Memory Database Store matching Supabase Tables
class AstrocDatabase {
  public users: AuthUser[] = [sampleUser];
  public profiles: UserProfile[] = [
    {
      id: 'prof_01',
      userId: 'usr_01',
      phone: '+62 812-3456-7890',
      linkedin: 'linkedin.com/in/rayhan-abdul',
      github: 'github.com/rayhan-abdul',
      portfolioUrl: 'rayhan-portfolio.dev',
      bio: 'Principal Software Architect & AI Tech Strategist',
      careerLevel: 'mid',
    },
  ];
  public cvs: ParsedCV[] = [...sampleCVs];
  public cvAnalysis: CVAnalysisResult[] = [
    {
      id: 'an_01',
      cvId: 'cv_01',
      overallCareerScore: 92,
      ats: {
        atsScore: 94,
        keywordMatchPercentage: 90,
        grammarScore: 96,
        formattingScore: 95,
        readabilityScore: 92,
        completenessPercentage: 98,
        missingKeywords: ['Kubernetes', 'GraphQL', 'CI/CD Pipelines'],
        formattingIssues: [],
        improvementTips: [
          'Tambahkan statistik kuantitatif pada achievement di posisi terdahulu.',
          'Gunakan istilah standar ATS seperti "Continuous Integration" di samping "CI/CD".',
        ],
      },
      hr: {
        hrScore: 90,
        strengths: [
          'Pengalaman teknis yang kuat dengan kombinasi unik Full Stack + AI LLM Integration.',
          'Penulisan achievement berbasis hasil dengan metrics terukur (turnaround time cut by 45%).',
          'Pendidikan Cumlaude dari universitas terkemuka.',
        ],
        weaknesses: [
          'Belum mencantumkan estimasi ukuran tim yang dikelola secara spesifik.',
          'Deskripsi sertifikasi dapat ditambahkan tautan kredensial resmi.',
        ],
        professionalismFeedback: 'CV sangat bersih, profesional, dan menggunakan action verbs yang tajam.',
        impactScore: 93,
        leadershipSignals: ['Head of Tech & Software Division UI', 'Memimpin code review'],
        communicationSignals: ['IELTS 7.5 Fluent', 'Cross-functional Collaboration'],
        rewriteSuggestions: [
          {
            original: 'Membuat dashboard analitik real-time berbasis React.',
            suggested: 'Merancang & meluncurkan dashboard analitik real-time berbasis React & Tailwind CSS yang digunakan oleh 20+ stakeholder bisnis.',
            reason: 'Menambahkan konteks bisnis dan jumlah pemakai (impact scale).',
          },
        ],
        overallHRVerdict: 'Kandidat kelas atas dengan potensi lolos wawancara HR hingga 92% untuk posisi Senior Developer / AI Specialist.',
      },
      analyzedAt: new Date().toISOString(),
    },
  ];

  public targetPositions: TargetPosition[] = [{ ...sampleTargetPosition }];
  public jobsRaw: any[] = [];
  public jobsProcessed: JobProcessed[] = [...sampleJobs];
  public jobMatches: JobMatch[] = [];
  public roadmaps: CareerRoadmap[] = [];
  public notifications: NotificationItem[] = [
    {
      id: 'notif_01',
      userId: 'usr_01',
      title: 'High Match Score Job Found! (94%)',
      message: 'Lowongan "Senior Full Stack Engineer (AI Integration)" di GoTo Group memiliki kecocokan 94% dengan CV Anda.',
      matchScore: 94,
      jobId: 'job_01',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ];
  public aiLogs: AILog[] = [
    {
      id: 'log_01',
      actionType: 'CV_ANALYSIS_PIPELINE',
      modelUsed: 'gemini-3.6-flash',
      latencyMs: 1240,
      status: 'success',
      details: 'CV Rayhan Abdul parsed, evaluated by ATS engine & HR 20+ Yrs Reviewer',
      timestamp: new Date().toISOString(),
    },
  ];

  constructor() {
    this.calculateInitialMatches();
  }

  public calculateInitialMatches() {
    const primaryCV = this.cvs[0];
    if (!primaryCV) return;

    const candidateSkills = primaryCV.skills.hardSkills.map((s) => s.toLowerCase());

    this.jobMatches = this.jobsProcessed.map((job, idx) => {
      const requiredSkills = job.requiredSkills.map((s) => s.toLowerCase());
      const matched = job.requiredSkills.filter((s) => candidateSkills.includes(s.toLowerCase()));
      const missing = job.requiredSkills.filter((s) => !candidateSkills.includes(s.toLowerCase()));

      const techRatio = requiredSkills.length ? matched.length / requiredSkills.length : 0.8;
      const techScore = Math.round(techRatio * 100);
      const softScore = 88;
      const overallMatch = Math.min(98, Math.max(65, Math.round(techScore * 0.6 + softScore * 0.4)));

      return {
        id: `match_${idx + 1}`,
        jobId: job.id,
        cvId: primaryCV.id || 'cv_01',
        job: { ...job, matchScore: overallMatch },
        overallMatchScore: overallMatch,
        technicalMatch: techScore,
        softSkillMatch: softScore,
        educationMatch: 95,
        experienceMatch: 90,
        atsProbability: overallMatch >= 80 ? 92 : 75,
        hrProbability: overallMatch >= 80 ? 88 : 70,
        interviewProbability: overallMatch >= 80 ? 85 : 65,
        offerProbability: overallMatch >= 80 ? 80 : 60,
        matchedSkills: matched,
        missingSkills: missing,
        matchReasoning: `Kandidat memiliki ${matched.length} dari ${job.requiredSkills.length} skill utama yang dibutuhkan oleh ${job.company}, termasuk ${matched.slice(0, 3).join(', ')}.`,
        calculatedAt: new Date().toISOString(),
      };
    });
  }

  public logAIAction(actionType: string, latencyMs: number, status: 'success' | 'error', details: string) {
    this.aiLogs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actionType,
      modelUsed: 'gemini-3.6-flash',
      latencyMs,
      status,
      details,
      timestamp: new Date().toISOString(),
    });
    // keep max 50 logs
    if (this.aiLogs.length > 50) this.aiLogs.pop();
  }

  public addNotification(title: string, message: string, matchScore?: number, jobId?: string) {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: 'usr_01',
      title,
      message,
      matchScore,
      jobId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const db = new AstrocDatabase();
