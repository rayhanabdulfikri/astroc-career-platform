import { Router } from 'express';
import { getMatching, calculateMatching } from '../controllers/matching.controller';

const router = Router();
router.get('/matching', getMatching);
router.get('/matching/evaluate', getMatching);
router.post('/matching/calculate', calculateMatching);

export default router;
