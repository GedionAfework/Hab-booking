import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../services";

export default function Flights({ user }) {
  const [flights, setFlights] = useState([]);
  const [query, setQuery] = useState({ origin: "", destination: "", date: "" });

  const handleChange = (e) => setQuery({ ...query, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await API.get("/flights", { params: query });
      setFlights(res.data);
    } catch {
      toast("Failed to fetch flights");
    }
  };

  const handleBook = async (flight) => {
    if (!user) return toast("You must be logged in to book a flight.");
    try {
      await API.post("/bookings", {
        itemType: "flight",
        flightInfo: flight,
        totalPrice: flight.price,
      });
      toast("Flight booked successfully!");
    } catch {
      toast("Failed to book flight. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Flights</h2>
      <form onSubmit={handleSearch} className="space-x-2 mb-6">
        <input name="origin" placeholder="From" onChange={handleChange} className="p-2 rounded border" />
        <input name="destination" placeholder="To" onChange={handleChange} className="p-2 rounded border" />
        <input name="date" type="date" onChange={handleChange} className="p-2 rounded border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </form>

      {flights.length > 0 ? (
        flights.map((f, i) => (
          <div key={i} className="border p-4 mb-3 rounded bg-white dark:bg-gray-800">
            <h3 className="font-semibold">{f.airline}</h3>
            <p>{f.origin} → {f.destination}</p>
            <p>Departure: {f.departureTime}</p>
            <p>Price: ${f.price}</p>
            <button onClick={() => handleBook(f)} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Book Flight</button>
          </div>
        ))
      ) : (
        <p>No flights found</p>
      )}
    </div>
  );
}
