import { Request, Response } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { sendSuccess } from '../utils/response';

export function login(req: Request, res: Response) {
  const { email } = req.body;
  let user = dbRepository.users.find((u) => u.email === email);
  if (!user) {
    user = {
      id: `usr_${Date.now()}`,
      email: email || 'user@astroc.ai',
      fullName: email ? email.split('@')[0].toUpperCase() : 'Rayhan Abdul',
      role: 'Job Seeker / AI Enthusiast',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    dbRepository.users.push(user);
  }
  return sendSuccess(res, {
    status: 'success',
    user,
    token: `fb_jwt_token_${Date.now()}`,
  });
}

export function getMe(req: Request, res: Response) {
  return sendSuccess(res, {
    user: dbRepository.users[0],
    profile: dbRepository.profiles[0],
  });
}
