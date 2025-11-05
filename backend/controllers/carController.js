import CarListing from '../models/CarListing.js';

export const createCarListing = async (req, res) => {
  try {
    const { make, model, year, mileage, fuelType, transmission, seats, price, currency } = req.body;

    if (!req.files || req.files.length < 5) {
      return res.status(400).json({ message: 'At least 5 images are required' });
    }
    const imagePaths = req.files.map(f => `/uploads/${f.filename}`);

    // Coerce and validate numbers
    const num = (v) => (v === '' || v === undefined ? undefined : Number(v));
    const yearNum = num(year);
    const seatsNum = num(seats);
    const priceNum = num(price);
    if (Number.isNaN(yearNum) || Number.isNaN(seatsNum) || Number.isNaN(priceNum)) {
      return res.status(400).json({ message: 'Invalid numeric values for year, seats, or price' });
    }

    const newCar = await CarListing.create({
      make,
      model,
      year: yearNum,
      mileage: num(mileage),
      fuelType,
      transmission,
      seats: seatsNum,
      price: priceNum,
      currency,
      images: imagePaths,
      owner: req.user._id,
    });

    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await CarListing.find().populate('owner', 'name email');
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await CarListing.findById(req.params.id).populate('owner', 'name email');
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await CarListing.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await car.deleteOne();
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const car = await CarListing.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }
    const fields = ['make','model','year','mileage','fuelType','transmission','seats','price','currency','hidden'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) car[f] = req.body[f];
    });
    if (req.files && req.files.length > 0) {
      if (req.files.length < 5) return res.status(400).json({ message: 'At least 5 images are required' });
      car.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    const saved = await car.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
