import { Router } from 'express';
import { getActiveCV, uploadCV, analyzeCV } from '../controllers/cv.controller';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';
import { optionalAuth, authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.get('/cv/current', optionalAuth, getActiveCV);
router.get('/cv/active', optionalAuth, getActiveCV);

router.post('/cv/upload', optionalAuth, aiRateLimiter, uploadCV);
router.post('/cv/analyze', optionalAuth, aiRateLimiter, analyzeCV);

export default router;
