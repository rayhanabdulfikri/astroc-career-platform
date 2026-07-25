import { Request, Response, NextFunction } from 'express';
import { cvRepository } from '../repositories/cv.repository';
import { userRepository } from '../repositories/user.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getSkillGap(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const activeTarget = await userRepository.getTargetPosition();
    if (!activeCV || !activeTarget) {
      return sendError(res, 'CV and Target Position required', 400);
    }

    const result = await aiService.analyzeSkillGapAI(activeCV, activeTarget);
    return sendSuccess(res, { skillGap: result });
  } catch (err) {
    next(err);
  }
}
