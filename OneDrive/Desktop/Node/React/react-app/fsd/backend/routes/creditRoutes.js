import express from 'express';
import {
  getMyCreditStatus,
  getAllUserDues,
  makeCreditPayment,
  setUserIdCreditLimit,
} from '../controllers/creditController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/my').get(protect, getMyCreditStatus);
router.route('/payment').post(protect, makeCreditPayment);
router.route('/dues').get(protect, authorize('owner'), getAllUserDues);
router.route('/limit/:userId').put(protect, authorize('owner'), setUserIdCreditLimit);

export default router;
