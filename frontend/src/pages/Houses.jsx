import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services";
import AvailableListings from "../components/AvailableListings";
import { Form, FormField, Input, Button } from "../components/ui";

export default function Houses() {
  const [houses, setHouses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [bookingDates, setBookingDates] = useState({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchHouses = async () => {
      const res = await API.get("/houses");
      setHouses(res.data);
      setFiltered(res.data);
    };
    fetchHouses();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    const next = houses.filter((house) => {
      if (!query) return true;
      const haystack = [house.location?.city, house.location?.country, house.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
    setFiltered(next);
  };

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
    <div className="space-y-10 text-gray-900 dark:text-gray-100">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold">Dream stays awaiting you</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
          Browse curated houses, lofts, and villas hosted by locals. Each listing features rich imagery, detailed amenities, and transparent pricing—book in a click.
        </p>
        <Form onSubmit={handleFilter} className="mt-6 max-w-xl">
          <FormField label="Filter by city or listing name" helper="Leave empty to show all homes">
            <div className="flex gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try Addis Ababa or beach"
              />
              <Button type="submit" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">Search</Button>
            </div>
          </FormField>
        </Form>
      </section>
      <AvailableListings
        title={`Available Houses (${filtered.length})`}
        listings={filtered}
        variant="house"
        bookingDates={bookingDates}
        setBookingDates={setBookingDates}
        onBook={handleBook}
      />
    </div>
  );
}

