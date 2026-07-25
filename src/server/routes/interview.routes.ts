import { Router } from 'express';
import { getInterviewQuestions, evaluateInterviewAnswer } from '../controllers/interview.controller';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();
router.get('/interview-questions', getInterviewQuestions);
router.post('/interview/simulate', aiRateLimiter, getInterviewQuestions);
router.post('/ai/evaluate-interview-answer', aiRateLimiter, validateBody(['question', 'answer']), evaluateInterviewAnswer);

export default router;
