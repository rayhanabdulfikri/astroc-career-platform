import { Router } from 'express';
import { getRoadmap, generateRoadmap } from '../controllers/roadmap.controller';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();
router.get('/roadmap', getRoadmap);
router.post('/roadmap/generate', aiRateLimiter, generateRoadmap);

export default router;
