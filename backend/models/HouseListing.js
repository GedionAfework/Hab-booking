import mongoose from "mongoose";

const houseListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["apartment", "house", "studio", "villa"],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "ETB",
  },
  location: {
    type: Map,
    of: String,
  },
  manualLocation: {
    type: [String],
  },
  bedroom: {
    type: Number,
    required: true,
  },
  bathroom: {
    type: Number,
    required: true,
  },
  kitchen: {
    type: Number,
    required: true,
  },
  livingRoom: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
  },
  size: {
    type: Number,
    required: true,
  },
  sizeStandard: {
    type: String,
    enum: ["sqft", "sqm"],
    default: "sqm",
  },
  images: {
    type: [String],
    required: true,
  },
  availableDates: {
    type: [Date],
  },
  amenities: {
    type: [String],
  },
  rules: {
    type: [String],
  },
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true }); 

export default mongoose.model("HouseListing", houseListingSchema);
