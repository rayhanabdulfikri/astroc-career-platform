import { Request, Response } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { sendSuccess } from '../utils/response';

export function getNotifications(req: Request, res: Response) {
  return sendSuccess(res, { notifications: dbRepository.notifications });
}

export function markNotificationsRead(req: Request, res: Response) {
  dbRepository.notifications.forEach((n) => (n.isRead = true));
  return sendSuccess(res, { status: 'success' });
}
