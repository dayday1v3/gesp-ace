import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import questionRoutes from './questions.js';
import practiceRoutes from './practice.js';
import diagnosisRoutes from './diagnosis.js';
import reportRoutes from './reports.js';
import codeRoutes from './code.js';
import mistakeRoutes from './mistakes.js';
import favoriteRoutes from './favorites.js';
import subjectRoutes from './subjects.js';
import levelRoutes from './levels.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/questions', questionRoutes);
router.use('/practice', practiceRoutes);
router.use('/diagnosis', diagnosisRoutes);
router.use('/reports', reportRoutes);
router.use('/code', codeRoutes);
router.use('/mistakes', mistakeRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/subjects', subjectRoutes);
router.use('/levels', levelRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
