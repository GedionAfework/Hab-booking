import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services";
import AvailableListings from "../components/AvailableListings";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [bookingDates, setBookingDates] = useState({});

  useEffect(() => {
    const fetchCars = async () => {
      const res = await API.get("/cars");
      setCars(res.data);
    };
    fetchCars();
  }, []);

  const handleBook = async (car, date) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!currentUser || !token) {
      toast("You must be logged in to book a car.");
      return;
    }
    if (!date) {
      toast("Select a booking date first");
      return;
    }
    try {
      await API.post("/bookings", {
        listingType: "car",
        listingId: car._id,
        totalPrice: car.price,
        startDate: date,
        endDate: date,
      });
      toast("Car booked successfully!");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to book car. Please try again.");
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">Get behind the wheel</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Handpicked vehicles ready for adventure or business. Review specifications, view immersive photos, and reserve instantly.
        </p>
      </section>
      <AvailableListings
        title="Available Cars"
        listings={cars}
        variant="car"
        bookingDates={bookingDates}
        setBookingDates={setBookingDates}
        onBook={handleBook}
      />
    </div>
  );
}

