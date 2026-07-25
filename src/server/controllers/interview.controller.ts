import { Request, Response, NextFunction } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export async function getInterviewQuestions(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = dbRepository.cvs[0];
    const activeTarget = dbRepository.targetPositions[0];
    const questions = await aiService.generateInterviewSimulationsAI(activeCV, activeTarget);
    return sendSuccess(res, { status: 'success', questions });
  } catch (err) {
    next(err);
  }
}

export async function evaluateInterviewAnswer(req: Request, res: Response, next: NextFunction) {
  try {
    const { question, answer, targetPosition } = req.body;
    const evaluation = await aiService.evaluateInterviewAnswerAI(question, answer, targetPosition || 'Software Engineer');
    return sendSuccess(res, evaluation);
  } catch (err) {
    next(err);
  }
}
