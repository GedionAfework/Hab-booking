import mongoose from "mongoose";

const flightListingSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
    },
    airline: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    seatsAvailable: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      default: "API", 
    },
  },
  { timestamps: true }
);

export default mongoose.model("FlightListing", flightListingSchema);
