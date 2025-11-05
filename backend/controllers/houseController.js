import HouseListing from '../models/HouseListing.js';

export const createHouseListing = async (req, res) => {
  try {
    const {
      name, type, description, price, currency, location, manualLocation, bedroom, bathroom, kitchen, livingRoom, capacity, size, sizeStandard, images, availableDates, amenities, rules,
    } = req.body;

    if (!req.files || req.files.length < 5) {
      return res.status(400).json({ message: 'At least 5 images are required' });
    }
    const imagePaths = req.files.map(f => `/uploads/${f.filename}`);

    // Coerce numeric fields and validate
    const num = (v) => (v === '' || v === undefined ? undefined : Number(v));
    const requiredNumbers = {
      bedroom: num(bedroom),
      bathroom: num(bathroom),
      kitchen: num(kitchen),
      livingRoom: num(livingRoom),
      size: num(size),
      price: num(price),
    };
    for (const [k, v] of Object.entries(requiredNumbers)) {
      if (typeof v !== 'number' || Number.isNaN(v)) {
        return res.status(400).json({ message: `Invalid or missing numeric field: ${k}` });
      }
    }

    const newHouse = await HouseListing.create({
      name,
      type,
      description,
      price: requiredNumbers.price,
      currency,
      location,
      manualLocation,
      bedroom: requiredNumbers.bedroom,
      bathroom: requiredNumbers.bathroom,
      kitchen: requiredNumbers.kitchen,
      livingRoom: requiredNumbers.livingRoom,
      capacity,
      size: requiredNumbers.size,
      sizeStandard,
      images: imagePaths,
      availableDates,
      amenities,
      rules,
      owner: req.user._id,
    });

    res.status(201).json(newHouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllHouses = async (req, res) => {
  try {
    const houses = await HouseListing.find({ hidden: false }).populate('owner', 'name email');
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHouseById = async (req, res) => {
  try {
    const house = await HouseListing.findById(req.params.id).populate('owner', 'name email');
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

    if (house.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await house.deleteOne();
    res.json({ message: 'House deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHouse = async (req, res) => {
  try {
    const house = await HouseListing.findById(req.params.id);
    if (!house) return res.status(404).json({ message: 'House not found' });
    if (house.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }
    const fields = ['name','type','description','price','currency','bedroom','bathroom','kitchen','livingRoom','size','sizeStandard','hidden'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) house[f] = req.body[f];
    });
    // Optional image replacement
    if (req.files && req.files.length > 0) {
      if (req.files.length < 5) return res.status(400).json({ message: 'At least 5 images are required' });
      house.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    const saved = await house.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
