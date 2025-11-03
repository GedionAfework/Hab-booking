import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createReview,
  getListingReviews,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Create a review
router.post('/', protect, createReview);

// Get all reviews for a listing
router.get('/:listingType/:listingId', getListingReviews);

// Delete a review
router.delete('/:id', protect, deleteReview);

export default router;
