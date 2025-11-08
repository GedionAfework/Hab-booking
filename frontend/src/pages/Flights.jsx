import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../services";
import FlightCard from "../components/FlightCard";
import { SingleDatePicker } from "../components/DateRangePicker";

const todayISO = () => new Date().toISOString().split("T")[0];

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ origin: "ADD", destination: "NBO" });
  const [travelDate, setTravelDate] = useState(todayISO());

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "origin" || name === "destination") {
      const cleaned = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
      setQuery((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setQuery((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.origin || !query.destination || !travelDate) {
      toast("Please fill origin, destination, and date");
      return;
    }
    try {
      setLoading(true);
      const res = await API.get("/flights/search", {
        params: {
          origin: query.origin,
          destination: query.destination,
          date: travelDate,
        },
      });
      setFlights(res.data || []);
      if (!res.data?.length) {
        toast("Showing sample flights for your route");
      }
    } catch (err) {
      toast(err.response?.data?.message || "Failed to fetch flights");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flight) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!currentUser || !token) {
      toast("You must be logged in to book a flight.");
      return;
    }
    if (!travelDate) {
      toast("Select a travel date before booking");
      return;
    }
    try {
      await API.post("/bookings", {
        listingType: "flight",
        listingId: flight.id,
        totalPrice: flight.price || 0,
        flightInfo: flight,
        startDate: travelDate,
        endDate: travelDate,
      });
      toast("Flight booked successfully!");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to book flight. Please try again.");
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-semibold">Search premium flights</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          Enter your travel route and date to explore live flight availability or curated sample routes. Book directly with one click.
        </p>
        <form onSubmit={handleSearch} className="mt-6 grid gap-4 lg:grid-cols-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-white/70">
            From (IATA)
            <input
              name="origin"
              placeholder="ADD"
              value={query.origin}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-base text-white placeholder:text-white/60 focus:border-white focus:ring-white"
              required
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-white/70">
            To (IATA)
            <input
              name="destination"
              placeholder="NBO"
              value={query.destination}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-base text-white placeholder:text-white/60 focus:border-white focus:ring-white"
              required
            />
          </label>
          <SingleDatePicker
            label="Travel date"
            value={travelDate}
            onChange={setTravelDate}
            min={todayISO()}
            variant="hero"
          />
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-white/90 px-4 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-white"
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Search flights'}
            </button>
          </div>
        </form>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-sm text-indigo-600">
          Fetching the best flights for you…
        </div>
      ) : flights.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-sm text-indigo-600">
          No flights to show yet. Try searching by airport codes like ADD → NBO.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} onBook={handleBook} travelDate={travelDate} />
          ))}
        </div>
      )}
    </div>
  );
}
