import { Request, Response, NextFunction } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export async function getRoadmap(req: Request, res: Response, next: NextFunction) {
  try {
    let roadmap = dbRepository.roadmaps[0];
    if (!roadmap) {
      const activeCV = dbRepository.cvs[0];
      const activeTarget = dbRepository.targetPositions[0];
      const latestAnalysis = dbRepository.cvAnalysis[0];
      const score = latestAnalysis ? latestAnalysis.overallCareerScore : 88;

      roadmap = await aiService.generateCareerRoadmapAI(activeCV, activeTarget, score);
      dbRepository.roadmaps.unshift(roadmap);
    }
    return sendSuccess(res, { roadmap });
  } catch (err) {
    next(err);
  }
}

export async function generateRoadmap(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = dbRepository.cvs[0];
    const activeTarget = dbRepository.targetPositions[0];
    const latestAnalysis = dbRepository.cvAnalysis[0];
    const score = latestAnalysis ? latestAnalysis.overallCareerScore : 88;

    const roadmap = await aiService.generateCareerRoadmapAI(activeCV, activeTarget, score);
    dbRepository.roadmaps.unshift(roadmap);
    return sendSuccess(res, { status: 'success', roadmap });
  } catch (err) {
    next(err);
  }
}
