import { Request, Response, NextFunction } from 'express';
import { cvRepository } from '../repositories/cv.repository';
import { userRepository } from '../repositories/user.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export async function getInterviewQuestions(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const activeTarget = await userRepository.getTargetPosition();
    if (!activeCV || !activeTarget) {
      return sendSuccess(res, { status: 'success', questions: [] });
    }

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
