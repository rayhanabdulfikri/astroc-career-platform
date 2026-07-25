import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes';
import { requestLogger } from './middleware/logging.middleware';
import { errorHandler } from './middleware/error.middleware';
import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { jobScheduler } from './services/scheduler.service';

const app = express();

// Security & Body Parser
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Request Logging & Rate Limiting
app.use(requestLogger);
app.use('/api', globalRateLimiter);

// Initialize Scheduler
jobScheduler.startScheduler();

// Mount API Routes
app.use('/api', apiRouter);

// Centralized Error Handling
app.use(errorHandler);

export default app;
