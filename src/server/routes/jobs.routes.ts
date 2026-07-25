import { Router } from 'express';
import { getJobs, searchJobs } from '../controllers/jobs.controller';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();
router.get('/jobs', getJobs);
// Aliases for /api/jobs/search and /api/jobs/search-grounding
router.post('/jobs/search', aiRateLimiter, searchJobs);
router.post('/jobs/search-grounding', aiRateLimiter, searchJobs);

export default router;
