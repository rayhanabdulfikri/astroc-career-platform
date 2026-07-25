import app from '../src/server/app';

// Disable Vercel's default body parser so Multer can handle multipart/form-data file uploads directly
export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
