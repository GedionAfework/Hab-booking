import React, { useEffect, useState } from "react";
import API from "../services";

export default function Cars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const res = await API.get("/cars");
      setCars(res.data);
    };
    fetchCars();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Cars</h2>
      {cars.map((car) => (
        <div key={car._id} className="border p-4 mb-3 rounded bg-white dark:bg-gray-800">
          <h3 className="font-semibold">{car.make} {car.model}</h3>
          <p>Price: ${car.price}</p>
          <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Book</button>
        </div>
      ))}
    </div>
  );
}
