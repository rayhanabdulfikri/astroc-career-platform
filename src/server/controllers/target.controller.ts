import { Request, Response } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { sendSuccess } from '../utils/response';

export function getTargetPosition(req: Request, res: Response) {
  return sendSuccess(res, { targetPosition: dbRepository.targetPositions[0] || null });
}

export function updateTargetPosition(req: Request, res: Response) {
  const { title, industry, expectedSalaryMin, expectedSalaryMax, location, remotePreference, experienceLevel } = req.body;

  const updated: any = {
    id: dbRepository.targetPositions[0]?.id || 'tgt_01',
    userId: 'usr_01',
    title: title || 'Full Stack AI Engineer',
    industry: industry || 'Technology',
    expectedSalaryMin: Number(expectedSalaryMin) || 15000000,
    expectedSalaryMax: Number(expectedSalaryMax) || 28000000,
    currency: 'IDR',
    location: location || 'Jakarta / Remote',
    remotePreference: remotePreference || 'hybrid',
    experienceLevel: experienceLevel || 'junior',
    updatedAt: new Date().toISOString(),
  };

  dbRepository.targetPositions[0] = updated;
  dbRepository.calculateInitialMatches();

  return sendSuccess(res, { status: 'success', targetPosition: updated });
}
