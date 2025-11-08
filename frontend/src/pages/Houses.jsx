import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services";
import AvailableListings from "../components/AvailableListings";

export default function Houses() {
  const [houses, setHouses] = useState([]);
  const [bookingDates, setBookingDates] = useState({});

  useEffect(() => {
    const fetchHouses = async () => {
      const res = await API.get("/houses");
      setHouses(res.data);
    };
    fetchHouses();
  }, []);

  const handleBook = async (house, range) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!currentUser || !token) {
      toast("You must be logged in to book a house.");
      return;
    }
    if (!range?.start || !range?.end) {
      toast("Select check-in and check-out dates first");
      return;
    }
    try {
      await API.post("/bookings", {
        listingType: "house",
        listingId: house._id,
        totalPrice: house.price,
        startDate: range.start,
        endDate: range.end,
      });
      toast("House booked successfully!");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to book house. Please try again.");
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-50 via-fuchsia-50 to-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">Dream stays awaiting you</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Browse curated houses, lofts, and villas hosted by locals. Each listing features rich imagery, detailed amenities, and transparent pricing—book in a click.
        </p>
      </section>
      <AvailableListings
        title="Available Houses"
        listings={houses}
        variant="house"
        bookingDates={bookingDates}
        setBookingDates={setBookingDates}
        onBook={handleBook}
      />
    </div>
  );
}

