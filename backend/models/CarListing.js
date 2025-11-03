import mongoose from "mongoose";

const carListingSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number },
  fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], required: true },
  transmission: { type: String, enum: ["Automatic", "Manual"], required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: "ETB" },
  images: { type: [String], required: true },
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("CarListing", carListingSchema);
