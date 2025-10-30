import Booking from '../models/Booking.js';
import HouseListing from '../models/HouseListing.js';
import CarListing from '../models/CarListing.js';

// @desc Create a booking
export const createBooking = async (req, res) => {
  try {
    const { itemType, itemId, totalPrice, flightInfo } = req.body;

    let item;

    // Check the type and find the item if needed
    if (itemType === 'house') {
      item = await HouseListing.findById(itemId);
      if (!item) return res.status(404).json({ message: 'House not found' });
    } else if (itemType === 'car') {
      item = await CarListing.findById(itemId);
      if (!item) return res.status(404).json({ message: 'Car not found' });
    } else if (itemType === 'flight') {
      if (!flightInfo) return res.status(400).json({ message: 'Flight info is required' });
      item = flightInfo; // no DB lookup, just use API data
    } else {
      return res.status(400).json({ message: 'Invalid item type' });
    }

    // Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      itemType,
      itemTypeRef: itemType === 'house' ? 'HouseListing' : itemType === 'car' ? 'CarListing' : 'FlightListing',
      itemId: itemType === 'flight' ? null : item._id,
      totalPrice,
      bookingDate: Date.now(),
      flightInfo: itemType === 'flight' ? item : undefined,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all bookings for logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('itemId'); // Populates house/car info
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('itemId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Cancel/Delete a booking
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
