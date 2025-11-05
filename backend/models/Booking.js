import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingType: {
      type: String,
      enum: ["car", "house", "flight"],
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "listingTypeModel"
    },
    listingTypeModel: {
      type: String,
      required: true,
      enum: ["CarListing", "HouseListing", "FlightListing"],
    },
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
