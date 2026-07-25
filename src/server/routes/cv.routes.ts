import { Router } from 'express';
import { getActiveCV, uploadCV, analyzeCV } from '../controllers/cv.controller';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();
// Aliases for /api/cv/current and /api/cv/active
router.get('/cv/current', getActiveCV);
router.get('/cv/active', getActiveCV);

// Upload and analyze with AI rate limiter
router.post('/cv/upload', aiRateLimiter, uploadCV);
router.post('/cv/analyze', aiRateLimiter, analyzeCV);

export default router;
