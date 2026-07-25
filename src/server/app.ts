import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { requestLogger } from './middleware/logging.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger';
import apiRouter from './routes/index';
import { jobScheduler } from './services/scheduler.service';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  // Gzip / Brotli Compression Middleware
  app.use(compression());

  // CORS Configuration
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsers & Cache Control
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP Cache Control Header Middleware
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
    next();
  });

  // Logging & Global Rate Limiting
  app.use(requestLogger);
  app.use(globalRateLimiter);

  // OpenAPI Swagger Documentation
  setupSwagger(app);

  // API Routes
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  // 404 & Global Error Handling (404 only for unhandled /api/* endpoints)
  app.use('/api/*', notFoundHandler);
  app.use(errorHandler);

  // Initialize Background Scheduler — disabled on Vercel Serverless (no persistent processes)
  // Only run in traditional Node.js server environments (Docker, Railway, Render, etc.)
  if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
    jobScheduler.startScheduler();
  }

  return app;
}

export default createApp();
