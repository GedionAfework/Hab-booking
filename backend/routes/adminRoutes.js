import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { updateUserRole, updateUser, deleteUser } from "../controllers/userController.js";
import { updateBookingByAdmin, deleteBookingByAdmin } from "../controllers/bookingController.js";
import User from "../models/user.js";
import Booking from "../models/Booking.js";

const router = express.Router();

router.get("/users", protect, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.get("/bookings", protect, admin, async (req, res) => {
  const bookings = await Booking.find().populate("user", "name email");
  res.json(bookings);
});

// Update a user's role (admin only)
router.patch("/users/:id/role", protect, admin, updateUserRole);

// Update a user's info (admin only)
router.put("/users/:id", protect, admin, updateUser);
router.delete("/users/:id", protect, admin, deleteUser);

// Booking admin routes
router.put("/bookings/:id", protect, admin, updateBookingByAdmin);
router.delete("/bookings/:id", protect, admin, deleteBookingByAdmin);

export default router;
