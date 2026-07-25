import { Router } from 'express';
import { getTargetPosition, updateTargetPosition } from '../controllers/target.controller';

const router = Router();
router.get('/target-position', getTargetPosition);
router.post('/target-position', updateTargetPosition);

export default router;
