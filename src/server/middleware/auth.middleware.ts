import { Request, Response, NextFunction } from 'express';
import { getFirebaseAdmin, getAuth } from '../config/firebaseAdmin';
import { userRepository } from '../repositories/user.repository';
import { sendError } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string;
  };
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized: Missing or invalid Bearer token header', 401);
  }

  const token = authHeader.split(' ')[1];
  const adminApp = getFirebaseAdmin();

  if (!adminApp) {
    const primaryUser = await userRepository.getPrimaryUser();
    req.user = {
      uid: primaryUser.id,
      email: primaryUser.email,
      fullName: primaryUser.fullName,
      role: primaryUser.role,
      avatarUrl: primaryUser.avatarUrl,
    };
    return next();
  }

  try {
    // Demo/Mock Token Support (Guest mode or demo auth fallback)
    if (token.startsWith('demo_') || token.startsWith('fb_jwt_token')) {
      const primaryUser = await userRepository.getPrimaryUser();
      req.user = {
        uid: primaryUser.id,
        email: primaryUser.email,
        fullName: primaryUser.fullName,
        role: primaryUser.role,
        avatarUrl: primaryUser.avatarUrl,
      };
      return next();
    }

    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(token);
    const email = decodedToken.email || 'user@astroc.ai';

    let dbUser = await userRepository.findByEmail(email);
    if (!dbUser) {
      dbUser = await userRepository.createUser(email);
    }

    req.user = {
      uid: decodedToken.uid,
      email: dbUser.email,
      fullName: decodedToken.name || dbUser.fullName,
      role: dbUser.role || 'job_seeker',
      avatarUrl: decodedToken.picture || dbUser.avatarUrl,
    };

    next();
  } catch (err: any) {
    console.warn('JWT Token Verification note (falling back to primary user):', err?.message);
    const primaryUser = await userRepository.getPrimaryUser();
    req.user = {
      uid: primaryUser.id,
      email: primaryUser.email,
      fullName: primaryUser.fullName,
      role: primaryUser.role,
      avatarUrl: primaryUser.avatarUrl,
    };
    next();
  }
}

export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateToken(req, res, next);
  }
  next();
}
