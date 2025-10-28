import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
  res.send("Server is reachable!");
});

const PORT = process.env.PORT || 3131;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
