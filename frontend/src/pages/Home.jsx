import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center mt-16">
      <h1 className="text-4xl font-bold mb-6">Welcome to Hab Booking</h1>
      <p className="mb-8 text-lg">
        Book houses, cars, and flights — all in one place!
      </p>

      <div className="flex justify-center gap-6 flex-wrap">
        <a href="/houses" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Browse Houses
        </a>
        <a href="/cars" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
          Browse Cars
        </a>
        <a href="/flights" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          Browse Flights
        </a>
      </div>
    </div>
  );
}
