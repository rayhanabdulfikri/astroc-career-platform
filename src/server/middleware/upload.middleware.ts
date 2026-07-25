import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

export const uploadCVFile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|doc|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Only PDF, DOCX, DOC, and TXT files are allowed.'));
    }
  },
});

export function handleUploadError(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File size exceeds maximum limit of 5MB', 400);
    }
    return sendError(res, `Upload error: ${err.message}`, 400);
  } else if (err) {
    return sendError(res, err.message || 'Error uploading file', 400);
  }
  next();
}
