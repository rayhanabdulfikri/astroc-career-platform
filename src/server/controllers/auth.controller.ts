import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { userRepository } from '../repositories/user.repository';
import { sendSuccess } from '../utils/response';

export async function login(req: AuthenticatedRequest, res: Response) {
  const email = req.user?.email || req.body.email || 'user@astroc.ai';
  let user = await userRepository.findByEmail(email);
  if (!user) {
    user = await userRepository.createUser(email);
  }
  return sendSuccess(res, {
    status: 'success',
    user,
  });
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  const email = req.user?.email;
  let user = email ? await userRepository.findByEmail(email) : await userRepository.getPrimaryUser();
  if (!user) {
    user = await userRepository.getPrimaryUser();
  }

  const profile = await userRepository.getProfile(user.id);
  return sendSuccess(res, { user, profile });
}
