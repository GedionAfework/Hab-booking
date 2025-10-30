import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createCarListing,
  getAllCars,
  getCarById,
  deleteCar,
} from '../controllers/carController.js';

const router = express.Router();

router.route('/')
  .get(getAllCars)       
  .post(protect, createCarListing); 

router.route('/:id')
  .get(getCarById)
  .delete(protect, deleteCar); 

export default router;
