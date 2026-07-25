import { Request, Response, NextFunction } from 'express';
import { dbRepository } from '../repositories/database.repository';
import { aiService } from '../services/ai.service';
import { sendSuccess, sendError } from '../utils/response';

export function getActiveCV(req: Request, res: Response) {
  const activeCV = dbRepository.cvs[0] || null;
  const latestAnalysis = dbRepository.cvAnalysis.find((a) => a.cvId === activeCV?.id) || dbRepository.cvAnalysis[0] || null;
  return sendSuccess(res, {
    activeCV,
    latestAnalysis,
    analysis: latestAnalysis,
  });
}

export async function uploadCV(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileName, rawText, presetId } = req.body;
    let textContent = rawText || '';

    if (!textContent && presetId) {
      const found = dbRepository.cvs.find((c) => c.id === presetId);
      if (found) textContent = found.rawText || found.summary;
    }

    if (!textContent) {
      textContent = `Rayhan Abdul Software Engineer. Pengalaman React, TypeScript, Node.js, Python, PostgreSQL, Gemini AI. Universitas Indonesia S.Kom GPA 3.82.`;
    }

    const parsedCV = await aiService.parseCV(textContent, fileName || 'Uploaded_CV.pdf');
    dbRepository.cvs.unshift(parsedCV);

    const analysisResult = await aiService.analyzeCVFullPipeline(parsedCV);
    dbRepository.cvAnalysis.unshift(analysisResult);

    dbRepository.calculateInitialMatches();

    return sendSuccess(res, {
      status: 'success',
      cv: parsedCV,
      parsed: parsedCV,
      analysis: analysisResult,
    });
  } catch (err) {
    next(err);
  }
}

export async function analyzeCV(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = dbRepository.cvs[0];
    if (!activeCV) {
      return sendError(res, 'No CV uploaded yet', 400);
    }
    const result = await aiService.analyzeCVFullPipeline(activeCV);
    dbRepository.cvAnalysis.unshift(result);
    return sendSuccess(res, { status: 'success', analysis: result });
  } catch (err) {
    next(err);
  }
}
