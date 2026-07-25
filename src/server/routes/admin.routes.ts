import { Router } from 'express';
import { triggerScheduler, getLogs } from '../controllers/admin.controller';

const router = Router();
router.post('/scheduler/trigger', triggerScheduler);
router.post('/admin/trigger-scheduler', triggerScheduler);
router.get('/logs', getLogs);

export default router;
