import CarListing from '../models/CarListing.js';

export const createCarListing = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      mileage,
      fuelType,
      transmission,
      seats,
      price,
      currency,
      images,
    } = req.body;

    const newCar = await CarListing.create({
      make,
      model,
      year,
      mileage,
      fuelType,
      transmission,
      seats,
      price,
      currency,
      images,
      listedBy: req.user._id, 
    });

    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await CarListing.find().populate('listedBy', 'name email');
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await CarListing.findById(req.params.id).populate('listedBy', 'name email');
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

    if (car.listedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await car.deleteOne();
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
