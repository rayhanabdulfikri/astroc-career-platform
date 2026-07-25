import { Router } from 'express';
import { getActiveCV, uploadCV, analyzeCV } from '../controllers/cv.controller';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';
import { optionalAuth } from '../middleware/auth.middleware';
import { uploadCVFile, handleUploadError } from '../middleware/upload.middleware';

const router = Router();
router.get('/cv/current', optionalAuth, getActiveCV);
router.get('/cv/active', optionalAuth, getActiveCV);

router.post(
  '/cv/upload',
  optionalAuth,
  aiRateLimiter,
  uploadCVFile.single('file'),
  handleUploadError,
  uploadCV
);

router.post('/cv/analyze', optionalAuth, aiRateLimiter, analyzeCV);

export default router;
