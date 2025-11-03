import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import houseRoutes from './routes/houseRoutes.js';
import carRoutes from './routes/carRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import flightRoutes from './routes/flightRoutes.js';


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/hab-booking/users", userRoutes);
app.use("/hab-booking/bookings", bookingRoutes);
app.use("/hab-booking/auth", authRoutes);
app.use("/hab-booking/houses", houseRoutes);
app.use("/hab-booking/cars", carRoutes);
app.use("/hab-booking/reviews", reviewRoutes);
app.use("/hab-booking/payments", paymentRoutes);
app.use('/hab-booking/flights', flightRoutes);

app.get("/api/test", (req, res) => {
  res.send("Server is reachable!");
});

const PORT = process.env.PORT || 3131;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
