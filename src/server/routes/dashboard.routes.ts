import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller';

const router = Router();
router.get('/dashboard', getDashboard);
router.get('/dashboard/overview', getDashboard);

export default router;
