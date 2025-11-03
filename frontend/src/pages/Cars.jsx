import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services";

export default function Cars({ user }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const res = await API.get("/cars");
      setCars(res.data);
    };
    fetchCars();
  }, []);

  const handleBook = async (car) => {
    if (!user) return toast("You must be logged in to book a car.");
    try {
      await API.post("/bookings", {
        itemType: "car",
        itemId: car._id,
        totalPrice: car.price,
      });
      toast("Car booked successfully!");
    } catch {
      toast("Failed to book car. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Cars</h2>
      {cars.map((car) => (
        <div key={car._id} className="border p-4 mb-3 rounded bg-white dark:bg-gray-800">
          <h3 className="font-semibold">{car.make} {car.model}</h3>
          <p>Price: ${car.price}</p>
          <button onClick={() => handleBook(car)} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Book</button>
        </div>
      ))}
    </div>
  );
}
