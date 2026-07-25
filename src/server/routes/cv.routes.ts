import { Router } from 'express';
import { getActiveCV, uploadCV, analyzeCV } from '../controllers/cv.controller';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();
router.get('/cv/current', optionalAuth, getActiveCV);
router.get('/cv/active', optionalAuth, getActiveCV);

// No Multer middleware — frontend extracts text client-side and sends JSON body
// This is required for Vercel Serverless compatibility (no binary multipart stream)
router.post('/cv/upload', optionalAuth, aiRateLimiter, uploadCV);

router.post('/cv/analyze', optionalAuth, aiRateLimiter, analyzeCV);

export default router;
