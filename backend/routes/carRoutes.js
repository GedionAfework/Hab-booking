import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { createCarListing, getAllCars, getCarById, deleteCar, updateCar } from '../controllers/carController.js';

const router = express.Router();

router.route('/')
  .get(getAllCars)
  .post(protect, upload.array('images', 6), createCarListing);

router.route('/:id')
  .get(getCarById)
  .delete(protect, deleteCar)
  .put(protect, upload.array('images', 10), updateCar);

export default router;
