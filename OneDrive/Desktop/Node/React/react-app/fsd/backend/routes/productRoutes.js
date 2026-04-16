import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getRecommendations,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, authorize('owner'), createProduct);
router.route('/recommendations').get(protect, getRecommendations);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, authorize('owner'), deleteProduct)
  .put(protect, authorize('owner'), updateProduct);

export default router;
