import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  ownerUpdateBookingStatus,
  getUserBookings,
  getBookingById,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my/bookings', protect, getMyBookings);
router.get('/owner/bookings', protect, getOwnerBookings);
router.patch('/owner/bookings/:bookingId/status', protect, ownerUpdateBookingStatus);

router.route('/')
  .get(protect, getUserBookings); // fallback: get own user bookings (legacy)

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, deleteBooking);

export default router;
