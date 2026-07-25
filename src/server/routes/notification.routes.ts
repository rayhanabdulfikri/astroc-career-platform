import { Router } from 'express';
import { getNotifications, markNotificationsRead } from '../controllers/notification.controller';

const router = Router();
router.get('/notifications', getNotifications);
router.post('/notifications/mark-read', markNotificationsRead);
router.post('/notifications/read-all', markNotificationsRead);

export default router;
