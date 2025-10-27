import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/hab-booking/users", userRoutes);
app.use("/hab-booking/bookings", bookingRoutes);
app.get('/hab-booking/test', (req, res) => {
  res.send('Server is reachable!');
});


const PORT = 3131;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));