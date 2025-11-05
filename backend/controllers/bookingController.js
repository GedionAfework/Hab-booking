import Booking from '../models/Booking.js';
import HouseListing from '../models/HouseListing.js';
import CarListing from '../models/CarListing.js';
import FlightListing from '../models/FlightListing.js';

// Create a booking: user can book any listing
export const createBooking = async (req, res) => {
  try {
    const { listingId, listingType, totalPrice } = req.body;
    let listing, listingTypeModel;
    if (listingType === 'house') {
      listingTypeModel = 'HouseListing';
      listing = await HouseListing.findById(listingId);
    } else if (listingType === 'car') {
      listingTypeModel = 'CarListing';
      listing = await CarListing.findById(listingId);
    } else if (listingType === 'flight') {
      listingTypeModel = 'FlightListing';
      listing = await FlightListing.findById(listingId);
    } else {
      return res.status(400).json({ message: 'Invalid listingType' });
    }
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    // Prevent owner from booking own listing
    if (listing.owner && String(listing.owner) === String(req.user._id)) {
      return res.status(403).json({ message: "Can't book your own listing" });
    }
    const booking = await Booking.create({
      user: req.user._id,
      listing: listing._id,
      listingType,
      listingTypeModel,
      totalPrice,
      status: 'pending',
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: get all their own bookings, populated
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'listing', populate: { path: 'owner', select: 'name email' } });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Owner: get all bookings for listings they own
export const getOwnerBookings = async (req, res) => {
  try {
    // Find all listings owned by user
    const houseIds = (await HouseListing.find({ owner: req.user._id })).map(h => h._id.toString());
    const carIds = (await CarListing.find({ owner: req.user._id })).map(c => c._id.toString());
    const flightIds = (await FlightListing.find({ owner: req.user._id })).map(f => f._id.toString());
    const bookings = await Booking.find({
      $or: [
        { listingType: 'house', listing: { $in: houseIds } },
        { listingType: 'car', listing: { $in: carIds } },
        { listingType: 'flight', listing: { $in: flightIds } },
      ],
    }).populate('user').populate({ path: 'listing' });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Owner: update status of a booking for their own listings
export const ownerUpdateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending','confirmed','rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending, confirmed, or rejected' });
    }
    const booking = await Booking.findById(req.params.bookingId).populate('listing');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Find the correct model and confirm ownership
    let listing;
    if (booking.listingType === 'house') {
      listing = await HouseListing.findById(booking.listing);
    } else if (booking.listingType === 'car') {
      listing = await CarListing.findById(booking.listing);
    } else if (booking.listingType === 'flight') {
      listing = await FlightListing.findById(booking.listing);
    }
    if (!listing || String(listing.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the owner can update this booking status' });
    }
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Cancel/Delete their booking (legacy, but needed for router)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }
    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('user');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'listing', populate: { path: 'owner', select: 'name email' } });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingByAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    Object.assign(booking, req.body);
    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBookingByAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    await booking.deleteOne();
    res.json({ message: 'Booking deleted by admin successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};