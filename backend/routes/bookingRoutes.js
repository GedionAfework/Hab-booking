import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// GET all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create a new booking
router.post('/', async (req, res) => {
    const { user, itemName, date, status } = req.body;
    try {
        const newBooking = new Booking({ user, itemName, date, status });
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
