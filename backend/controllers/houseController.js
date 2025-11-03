import HouseListing from '../models/HouseListing.js';

export const createHouseListing = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      price,
      currency,
      location,
      manualLocation,
      bedroom,
      bathroom,
      kitchen,
      livingRoom,
      capacity,
      size,
      sizeStandard,
      images,
      availableDates,
      amenities,
      rules,
    } = req.body;

    const newHouse = await HouseListing.create({
      name,
      type,
      description,
      price,
      currency,
      location,
      manualLocation,
      bedroom,
      bathroom,
      kitchen,
      livingRoom,
      capacity,
      size,
      sizeStandard,
      images,
      availableDates,
      amenities,
      rules,
      listedBy: req.user._id, 
    });

    res.status(201).json(newHouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllHouses = async (req, res) => {
  try {
    const houses = await HouseListing.find().populate('listedBy', 'name email');
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHouseById = async (req, res) => {
  try {
    const house = await HouseListing.findById(req.params.id).populate('listedBy', 'name email');
    if (!house) return res.status(404).json({ message: 'House not found' });
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHouse = async (req, res) => {
  try {
    const house = await HouseListing.findById(req.params.id);
    if (!house) return res.status(404).json({ message: 'House not found' });

    if (house.listedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await house.deleteOne();
    res.json({ message: 'House deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
