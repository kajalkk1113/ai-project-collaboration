
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import {
  getDashboardStats,
  getProjectAnalytics,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);

router.get('/project/:projectId', protect, getProjectAnalytics);

export default router;
