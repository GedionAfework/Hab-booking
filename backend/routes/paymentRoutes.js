import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPayment,
  getUserPayments,
  updatePaymentStatus
} from '../controllers/paymentController.js';

const router = express.Router();

// Create a payment for a booking
router.post('/', protect, createPayment);

// Get all payments for logged-in user
router.get('/user', protect, getUserPayments);

// Update payment status (admin or owner)
router.put('/:id', protect, updatePaymentStatus);

export default router;
