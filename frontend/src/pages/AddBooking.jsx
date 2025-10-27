import React, { useState } from "react";
import API from "../services";
import { useNavigate } from "react-router-dom";

const AddBooking = () => {
  const [itemName, setItemName] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bookings", {
        user: "PUT_USER_ID_HERE",
        itemName,
        date,
      });
      navigate("/bookings");
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add Booking</h2>

        <input
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Booking
        </button>
      </form>
    </div>
  );
};

export default AddBooking;
