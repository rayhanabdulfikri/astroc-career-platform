export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  firebaseUid?: string;
  role: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
  bio?: string;
  careerLevel?: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface Experience {
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string[];
  techStack: string[];
}

export interface Organization {
  name: string;
  role: string;
  period: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  link?: string;
  techStack: string[];
}

export interface Certificate {
  name: string;
  issuer: string;
  year: string;
}

export interface Skills {
  hardSkills: string[];
  softSkills: string[];
  languages: string[];
}

export interface ParsedCV {
  id?: string;
  fileName: string;
  uploadedAt: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  organization: Organization[];
  projects: Project[];
  achievements: string[];
  certificates: Certificate[];
  skills: Skills;
  rawText?: string;
}

export interface ATSEvaluation {
  atsScore: number;
  keywordMatchPercentage: number;
  grammarScore: number;
  formattingScore: number;
  readabilityScore: number;
  completenessPercentage: number;
  missingKeywords: string[];
  formattingIssues: string[];
  improvementTips: string[];
}

export interface HRReview {
  hrScore: number;
  strengths: string[];
  weaknesses: string[];
  professionalismFeedback: string;
  impactScore: number;
  leadershipSignals: string[];
  communicationSignals: string[];
  rewriteSuggestions: Array<{
    original: string;
    suggested: string;
    reason: string;
  }>;
  overallHRVerdict: string;
}

export interface CVAnalysisResult {
  id: string;
  cvId: string;
  overallCareerScore: number;
  ats: ATSEvaluation;
  hr: HRReview;
  analyzedAt: string;
}

export interface TargetPosition {
  id: string;
  userId: string;
  title: string;
  industry: string;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  currency: string;
  location: string;
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
  experienceLevel: 'fresh_graduate' | 'junior' | 'mid' | 'senior' | 'lead';
  updatedAt: string;
}

export interface JobProcessed {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  experienceLevel: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  sourceUrl: string;
  postedDate: string;
  isActive: boolean;
  matchScore?: number;
}

export interface JobMatch {
  id: string;
  jobId: string;
  cvId: string;
  job: JobProcessed;
  overallMatchScore: number;
  technicalMatch: number;
  softSkillMatch: number;
  educationMatch: number;
  experienceMatch: number;
  atsProbability: number;
  hrProbability: number;
  interviewProbability: number;
  offerProbability: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchReasoning: string;
  calculatedAt: string;
}

export interface SkillGapItem {
  skill: string;
  category: 'hard' | 'soft' | 'domain';
  isAcquired: boolean;
  priority: 'High' | 'Medium' | 'Low';
  estimatedLearningHours: number;
  estimatedTimeFrame: string;
  recommendedResource: string;
}

export interface SkillGapAnalysis {
  targetPosition: string;
  totalRequiredSkills: number;
  acquiredCount: number;
  missingCount: number;
  gapScore: number; // 0-100 readiness
  acquiredSkills: string[];
  missingSkills: SkillGapItem[];
}

export interface RoadmapPhase {
  phaseTitle: string;
  duration: string;
  targetRole: string;
  learningPath: string[];
  certifications: string[];
  recommendedProjects: string[];
  keyMilestones: string[];
}

export interface CareerRoadmap {
  id: string;
  userId: string;
  targetPosition: string;
  currentScore: number;
  estimatedMonthsToTarget: number;
  phases: RoadmapPhase[];
  generatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'HR' | 'Technical' | 'Behavioral' | 'Case Study';
  question: string;
  whyHRAsks: string;
  keyPointsToCover: string[];
  idealAnswer: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  matchScore?: number;
  jobId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AILog {
  id: string;
  actionType: string;
  modelUsed: string;
  latencyMs: number;
  status: 'success' | 'error';
  details: string;
  timestamp: string;
}

export interface DashboardData {
  user: AuthUser;
  targetPosition: TargetPosition | null;
  activeCV: ParsedCV | null;
  latestAnalysis: CVAnalysisResult | null;
  overallCareerScore: number;
  atsScore: number;
  hrScore: number;
  cvCount: number;
  matchesCount: number;
  totalJobsInDatabase: number;
  topMatchingJobs: JobMatch[];
  skillGap: SkillGapAnalysis | null;
  interviewReadiness: number;
  notificationsCount: number;
}
