import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

// @desc Create a payment for a booking
export const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, currency, paymentMethod } = req.body;

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' });
    }

    const payment = await Payment.create({
      booking: bookingId,
      amount,
      currency,
      paymentMethod,
      status: 'pending',
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all payments for logged-in user
export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ 'booking.user': req.user._id })
      .populate({
        path: 'booking',
        populate: { path: 'itemId', select: '-__v' } // populate house/car info
      });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update payment status (completed, failed)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Only the user who made the payment or admin can update
    if (payment.booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this payment' });
    }

    payment.status = status;
    if (status === 'completed') payment.paidAt = Date.now();

    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
