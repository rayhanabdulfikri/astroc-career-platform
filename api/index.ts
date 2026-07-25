import app from '../src/server/app';

// Allow Vercel's default body parser to handle JSON requests
// We no longer use multipart/form-data (Multer) — all uploads are now JSON (text-based)
export default app;
