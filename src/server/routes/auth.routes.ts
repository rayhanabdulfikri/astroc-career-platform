import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();
router.post('/auth/login', validateBody(['email']), login);
router.get('/auth/me', getMe);

export default router;
