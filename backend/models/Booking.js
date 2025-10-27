import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listingType: { type: String, enum: ["house", "car"], required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "listingTypeRef" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
}, { timestamps: true });

bookingSchema.virtual("listingTypeRef").get(function () {
  return this.listingType === "car" ? "CarListing" : "Listing";
});

export default mongoose.model("Booking", bookingSchema);
