import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { createHouseListing, getAllHouses, getHouseById, deleteHouse, updateHouse } from '../controllers/houseController.js';

const router = express.Router();

router.route('/')
  .get(getAllHouses)
  .post(protect, upload.array('images', 6), createHouseListing);

router.route('/:id')
  .get(getHouseById)
  .delete(protect, deleteHouse)
  .put(protect, upload.array('images', 10), updateHouse);

export default router;
