import { Request, Response, NextFunction } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getSkillGap(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = dbRepository.cvs[0];
    const activeTarget = dbRepository.targetPositions[0];
    if (!activeCV || !activeTarget) {
      return sendError(res, 'CV and Target Position required', 400);
    }

    const result = await aiService.analyzeSkillGapAI(activeCV, activeTarget);
    return sendSuccess(res, { skillGap: result });
  } catch (err) {
    next(err);
  }
}
