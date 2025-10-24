import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true},
    itemName: {
        type: String,
        required: true},
    date: {
        type: Date,
        required: true},
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'},
    }
);

export default mongoose.model('Booking', bookingSchema);