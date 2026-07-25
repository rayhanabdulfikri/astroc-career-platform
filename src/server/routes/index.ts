import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import cvRoutes from './cv.routes';
import targetRoutes from './target.routes';
import jobsRoutes from './jobs.routes';
import matchingRoutes from './matching.routes';
import skillgapRoutes from './skillgap.routes';
import roadmapRoutes from './roadmap.routes';
import interviewRoutes from './interview.routes';
import dashboardRoutes from './dashboard.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';

const apiRouter = Router();

apiRouter.use('/', healthRoutes);
apiRouter.use('/', authRoutes);
apiRouter.use('/', cvRoutes);
apiRouter.use('/', targetRoutes);
apiRouter.use('/', jobsRoutes);
apiRouter.use('/', matchingRoutes);
apiRouter.use('/', skillgapRoutes);
apiRouter.use('/', roadmapRoutes);
apiRouter.use('/', interviewRoutes);
apiRouter.use('/', dashboardRoutes);
apiRouter.use('/', notificationRoutes);
apiRouter.use('/', adminRoutes);

export default apiRouter;
