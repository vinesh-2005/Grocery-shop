import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('owner'), getAnalytics);

export default router;
