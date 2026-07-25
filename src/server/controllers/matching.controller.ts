import { Request, Response } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { sendSuccess } from '../utils/response';

export function getMatching(req: Request, res: Response) {
  return sendSuccess(res, {
    matches: dbRepository.jobMatches,
    topMatch: dbRepository.jobMatches[0] || null,
  });
}

export function calculateMatching(req: Request, res: Response) {
  dbRepository.calculateInitialMatches();
  return sendSuccess(res, { status: 'success', matches: dbRepository.jobMatches });
}
