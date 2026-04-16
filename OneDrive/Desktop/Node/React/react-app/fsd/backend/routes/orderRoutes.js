import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  getAssignedOrders,
  getAvailableOrders,
  getRecommendations,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, authorize('owner'), getOrders);

router.route('/mine').get(protect, getMyOrders);
router.route('/recommendations').get(protect, getRecommendations);
router.route('/assigned').get(protect, authorize('delivery_agent'), getAssignedOrders);
router.route('/available').get(protect, authorize('delivery_agent'), getAvailableOrders);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router
  .route('/:id/status')
  .put(protect, authorize('owner', 'delivery_agent'), updateOrderStatus);

export default router;
