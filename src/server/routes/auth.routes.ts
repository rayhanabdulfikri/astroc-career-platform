import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { optionalAuth, authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.post('/auth/login', optionalAuth, login);
router.post('/auth/verify', authenticateToken, login);
router.get('/auth/me', optionalAuth, getMe);

export default router;
