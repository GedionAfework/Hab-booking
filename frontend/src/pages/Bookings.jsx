import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings");
        setBookings(res.data);
      } catch {
        toast("Login required to view bookings");
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.map((b) => (
        <div key={b._id} className="border p-4 mb-3 rounded bg-white dark:bg-gray-800">
          <h3>{b.itemType.toUpperCase()} Booking</h3>
          <p>Status: {b.status}</p>
          <p>Total: ${b.totalPrice}</p>
        </div>
      ))}
    </div>
  );
}
