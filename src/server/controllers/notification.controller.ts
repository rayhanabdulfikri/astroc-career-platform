import { Request, Response, NextFunction } from 'express';
import { notificationRepository } from '../repositories/notification.repository';
import { sendSuccess } from '../utils/response';

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const notifications = await notificationRepository.getNotifications();
    return sendSuccess(res, { notifications });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationsRead(req: Request, res: Response, next: NextFunction) {
  try {
    await notificationRepository.markAllRead();
    return sendSuccess(res, { status: 'success' });
  } catch (err) {
    next(err);
  }
}
