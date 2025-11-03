import React, { useState } from "react";
import API from "../services";

export default function AddBooking({ user }) {
  const [form, setForm] = useState({
    itemType: "",
    itemId: "",
    totalPrice: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to add a booking.");
    try {
      await API.post("/bookings", form);
      alert("Booking added!");
    } catch {
      alert("Failed to add booking. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="itemType" onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Type</option>
          <option value="house">House</option>
          <option value="car">Car</option>
          <option value="flight">Flight</option>
        </select>
        <input name="itemId" placeholder="Item ID" onChange={handleChange} className="border p-2 rounded" />
        <input name="totalPrice" placeholder="Total Price" onChange={handleChange} className="border p-2 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Booking</button>
      </form>
    </div>
  );
}
