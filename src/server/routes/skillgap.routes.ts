import { Router } from 'express';
import { getSkillGap } from '../controllers/skillgap.controller';

const router = Router();
router.get('/skill-gap', getSkillGap);

export default router;
