import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)    
  .get(protect, getUserBookings);  

router.route('/:id')
  .get(protect, getBookingById)    
  .delete(protect, deleteBooking); 

export default router;
