import express from 'express';
import {
  createRequest,
  getRequests,
  updateRequestStatus,
  getMyRequests,
} from '../controllers/productRequestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, createRequest)
  .get(protect, authorize('owner'), getRequests);

router.route('/mine').get(protect, getMyRequests);

router.route('/:id').put(protect, authorize('owner'), updateRequestStatus);

export default router;
