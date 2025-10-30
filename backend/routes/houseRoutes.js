import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createHouseListing,
  getAllHouses,
  getHouseById,
  deleteHouse,
} from '../controllers/houseController.js';

const router = express.Router();

router.route('/')
  .get(getAllHouses)       
  .post(protect, createHouseListing); 

router.route('/:id')
  .get(getHouseById)
  .delete(protect, deleteHouse); 

export default router;
