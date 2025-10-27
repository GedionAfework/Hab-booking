import React, { useEffect, useState } from "react";
import API from "../services";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await API.get("/bookings");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Bookings</h1>
      <Link
        to="/add-booking"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Add Booking
      </Link>

      <ul className="mt-6 space-y-3">
        {bookings.map((b) => (
          <li key={b._id} className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold">{b.itemName}</h2>
            <p>Status: {b.status}</p>
            <p>Date: {new Date(b.date).toLocaleString()}</p>
            <Link
              to={`/bookings/${b._id}`}
              className="text-blue-600 hover:underline"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookings;
