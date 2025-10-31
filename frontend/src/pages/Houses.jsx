import React, { useEffect, useState } from "react";
import API from "../services";

export default function Houses() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchHouses = async () => {
      const res = await API.get("/houses");
      setHouses(res.data);
    };
    fetchHouses();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Houses</h2>
      {houses.map((house) => (
        <div key={house._id} className="border p-4 mb-3 rounded bg-white dark:bg-gray-800">
          <h3 className="font-semibold">{house.title}</h3>
          <p>Location: {house.location}</p>
          <p>Price: ${house.price}</p>
          <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Book</button>
        </div>
      ))}
    </div>
  );
}
