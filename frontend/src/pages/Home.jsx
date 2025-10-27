import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Welcome to Hab Booking</h1>
      <p className="text-gray-600 mb-6">
        Book your favorite rooms easily and manage all your reservations in one place.
      </p>
      <Link
        to="/bookings"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        View Bookings
      </Link>
    </div>
  );
};

export default Home;
