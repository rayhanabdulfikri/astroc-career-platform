import { Request, Response, NextFunction } from 'express';
import { cvRepository } from '../repositories/cv.repository';
import { matchingRepository } from '../repositories/matching.repository';
import { jobRepository } from '../repositories/job.repository';
import { extractorService } from '../services/extractor.service';
import { storageService } from '../services/storage.service';
import { aiService } from '../services/ai.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getActiveCV(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const latestAnalysis = await cvRepository.getLatestAnalysis(activeCV?.id);
    return sendSuccess(res, {
      activeCV,
      latestAnalysis,
      analysis: latestAnalysis,
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadCV(req: Request, res: Response, next: NextFunction) {
  try {
    let textContent = '';
    let fileName = 'Uploaded_CV.pdf';
    let fileUrl = '';

    if (req.file) {
      fileName = req.file.originalname;
      textContent = await extractorService.extractText(req.file.buffer, req.file.mimetype, fileName);
      fileUrl = await storageService.uploadCVFile(req.file.buffer, fileName, req.file.mimetype);
    } else {
      const { rawText, presetId, fileName: bodyFileName } = req.body;
      textContent = rawText || '';
      if (bodyFileName) fileName = bodyFileName;

      if (!textContent && presetId) {
        const allCVs = cvRepository.getAllCVs();
        const found = allCVs.find((c) => c.id === presetId);
        if (found) textContent = found.rawText || found.summary;
      }
    }

    if (!textContent || textContent.trim().length === 0) {
      textContent = `Rayhan Abdul Software Engineer. Pengalaman React, TypeScript, Node.js, Python, PostgreSQL, Gemini AI. Universitas Indonesia S.Kom GPA 3.82.`;
    }

    const parsedCV = await aiService.parseCV(textContent, fileName);
    await cvRepository.saveCV(parsedCV, fileUrl);

    const analysisResult = await aiService.analyzeCVFullPipeline(parsedCV);
    await cvRepository.saveAnalysis(analysisResult);

    const jobs = await jobRepository.getJobs();
    matchingRepository.recalculateMatches(parsedCV, jobs);

    return sendSuccess(res, {
      status: 'success',
      cv: parsedCV,
      parsed: parsedCV,
      analysis: analysisResult,
      fileUrl,
    });
  } catch (err) {
    next(err);
  }
}

export async function analyzeCV(req: Request, res: Response, next: NextFunction) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    if (!activeCV) {
      return sendError(res, 'No CV uploaded yet', 400);
    }
    const result = await aiService.analyzeCVFullPipeline(activeCV);
    await cvRepository.saveAnalysis(result);
    return sendSuccess(res, { status: 'success', analysis: result });
  } catch (err) {
    next(err);
  }
}
