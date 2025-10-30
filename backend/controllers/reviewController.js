import Review from '../models/Review.js';
import HouseListing from '../models/HouseListing.js';
import CarListing from '../models/CarListing.js';

// @desc Create a review for a listing
export const createReview = async (req, res) => {
  try {
    const { listingType, listingId, rating, comment } = req.body;

    // Validate listing
    let listing;
    if (listingType === 'HouseListing') {
      listing = await HouseListing.findById(listingId);
      if (!listing) return res.status(404).json({ message: 'House listing not found' });
    } else if (listingType === 'CarListing') {
      listing = await CarListing.findById(listingId);
      if (!listing) return res.status(404).json({ message: 'Car listing not found' });
    } else {
      return res.status(400).json({ message: 'Invalid listing type' });
    }

    // Check if user already reviewed this listing
    const existingReview = await Review.findOne({
      user: req.user._id,
      listing: listingId,
      listingType
    });
    if (existingReview) return res.status(400).json({ message: 'You already reviewed this listing' });

    const review = await Review.create({
      user: req.user._id,
      listing: listingId,
      listingType,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all reviews for a listing
export const getListingReviews = async (req, res) => {
  try {
    const { listingType, listingId } = req.params;

    const reviews = await Review.find({ listingType, listing: listingId })
      .populate('user', 'name email');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
