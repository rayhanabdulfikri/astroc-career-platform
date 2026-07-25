import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';
import apiRouter from './src/server/routes';
import { requestLogger } from './src/server/middleware/logging.middleware';
import { errorHandler } from './src/server/middleware/error.middleware';
import { globalRateLimiter } from './src/server/middleware/rateLimiter.middleware';
import { jobScheduler } from './src/server/services/scheduler.service';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // 1. Security & Core Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP in dev for inline Vite scripts & styles
  }));
  app.use(cors());
  app.use(express.json({ limit: '15mb' }));

  // 2. Logging & Global Rate Limiting
  app.use(requestLogger);
  app.use('/api', globalRateLimiter);

  // 3. Background Job Scheduler Initialization
  jobScheduler.startScheduler();

  // 4. API Router Registration
  app.use('/api', apiRouter);

  // 5. Centralized Error Handling Middleware
  app.use(errorHandler);

  // 6. Vite SPA Server Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 ASTROC AI Career Intelligence Platform running on http://localhost:${PORT}`);
  });
}

startServer();
