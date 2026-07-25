import { aiService } from './services/ai.service';

export const parseCVWithAI = (rawCvText: string, fileName: string) => aiService.parseCV(rawCvText, fileName);
export const analyzeCVFullPipeline = (cv: any) => aiService.analyzeCVFullPipeline(cv);
export const searchJobsWithSearchGrounding = (targetPos: any, cvSkills: string[]) => aiService.searchJobsWithSearchGrounding(targetPos, cvSkills);
export const analyzeSkillGapAI = (cv: any, targetPos: any) => aiService.analyzeSkillGapAI(cv, targetPos);
export const generateCareerRoadmapAI = (cv: any, targetPos: any, overallScore: number) => aiService.generateCareerRoadmapAI(cv, targetPos, overallScore);
export const generateInterviewSimulationsAI = (cv: any, targetPos: any) => aiService.generateInterviewSimulationsAI(cv, targetPos);
