import { Request, Response, NextFunction } from 'express';
import { roadmapRepository } from '../repositories/roadmap.repository';
import { cvRepository } from '../repositories/cv.repository';
import { userRepository } from '../repositories/user.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export async function getRoadmap(req: Request, res: Response, next: NextFunction) {
  try {
    let roadmap = await roadmapRepository.getRoadmap();
    if (!roadmap) {
      const activeCV = await cvRepository.getActiveCV();
      const activeTarget = await userRepository.getTargetPosition();
      const latestAnalysis = await cvRepository.getLatestAnalysis();
      const score = latestAnalysis ? latestAnalysis.overallCareerScore : 88;

      if (activeCV && activeTarget) {
        roadmap = await aiService.generateCareerRoadmapAI(activeCV, activeTarget, score);
        await roadmapRepository.saveRoadmap(roadmap);
      }
    }
    return sendSuccess(res, { roadmap });
  } catch (err) {
    next(err);
  }
}

export async function generateRoadmap(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const activeTarget = await userRepository.getTargetPosition();
    const latestAnalysis = await cvRepository.getLatestAnalysis();
    const score = latestAnalysis ? latestAnalysis.overallCareerScore : 88;

    if (!activeCV || !activeTarget) {
      return sendSuccess(res, { roadmap: null });
    }

    const roadmap = await aiService.generateCareerRoadmapAI(activeCV, activeTarget, score);
    await roadmapRepository.saveRoadmap(roadmap);
    return sendSuccess(res, { status: 'success', roadmap });
  } catch (err) {
    next(err);
  }
}
