import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API, { UPLOADS_BASE } from "../services";
import {
  IoSearch,
  IoHeartOutline,
  IoHeart,
  IoStar,
  IoLocationOutline,
  IoPeopleOutline,
  IoBedOutline,
} from "react-icons/io5";
import { DateRangePicker } from "../components/DateRangePicker";

const resolveImage = (src) => {
  if (!src) return src;
  return src.startsWith("/uploads") ? `${UPLOADS_BASE}${src}` : src;
};

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [bookingDates, setBookingDates] = useState({});
  const [query, setQuery] = useState({ location: "", checkIn: "", checkOut: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await API.get("/houses");
        setHouses(res.data);
        setFiltered(res.data);
      } catch (err) {
        toast(err.response?.data?.message || "Failed to load houses");
      }
    };
    fetchHouses();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const next = houses.filter((house) => {
      const matchesLocation = query.location
        ? [house.location?.city, house.location?.country, house.name]
            .filter(Boolean)
            .some((val) => val.toLowerCase().includes(query.location.toLowerCase()))
        : true;
      return matchesLocation;
    });
    setFiltered(next);
  };

  const handleDateChange = (id, range) => {
    setBookingDates((prev) => ({ ...prev, [id]: range }));
  };

  const handleBook = async (house) => {
    const range = bookingDates[house._id] || {};
    if (!range.start || !range.end) {
      toast("Add check-in and check-out dates first");
      return;
    }
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!currentUser || !token) {
      toast("You must be logged in to book a house.");
      return;
    }
    try {
      setLoading(true);
      await API.post("/bookings", {
        listingType: "house",
        listingId: house._id,
        totalPrice: house.price,
        startDate: range.start,
        endDate: range.end,
      });
      toast("House booked successfully");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to book house");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find your perfect stay</h1>
            <p className="text-sm text-gray-500">
              Browse handpicked villas, apartments, and cabins across the globe.
            </p>
          </div>

          <form onSubmit={handleSearch} className="rounded-3xl border border-white bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Location
                <input
                  value={query.location}
                  onChange={(e) => setQuery((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Try Addis Ababa"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Check-in (optional filter)
                <input
                  type="date"
                  value={query.checkIn}
                  onChange={(e) => setQuery((prev) => ({ ...prev, checkIn: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Check-out (optional filter)
                <input
                  type="date"
                  value={query.checkOut}
                  onChange={(e) => setQuery((prev) => ({ ...prev, checkOut: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow hover:from-blue-500 hover:to-indigo-500">
                <IoSearch className="text-lg" />
                Search houses
              </button>
            </div>
          </form>
        </section>

        <section className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Available properties ({filtered.length})
            </h2>
            <p className="text-sm text-gray-500">Choose the home that fits your trip</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-blue-500 hover:text-blue-600">
              Grid view
            </button>
            <button className="rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition hover:text-blue-600">
              Map view
            </button>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((house) => {
            const isFavorite = favorites.includes(house._id);
            const firstImage = resolveImage(house.images?.[0]);
            const range = bookingDates[house._id] || { start: "", end: "" };
            return (
              <div
                key={house._id}
                className="overflow-hidden rounded-2xl border border-white bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-60 overflow-hidden">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={house.name}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                      No image
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(house._id)}
                    className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-red-500 shadow backdrop-blur hover:bg-white"
                  >
                    {isFavorite ? <IoHeart className="text-lg" /> : <IoHeartOutline className="text-lg" />}
                  </button>
                </div>
                <div className="space-y-5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{house.name}</h3>
                      <p className="flex items-center gap-1 text-sm text-gray-500">
                        <IoLocationOutline /> {house.location?.city || house.location || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-yellow-500">
                      <IoStar />
                      <span className="text-gray-700">{Number(house.rating || 4.8).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {house.guests && (
                      <span className="inline-flex items-center gap-1"><IoPeopleOutline /> {house.guests} guests</span>
                    )}
                    {house.bedroom && (
                      <span className="inline-flex items-center gap-1"><IoBedOutline /> {house.bedroom} bedrooms</span>
                    )}
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                    <DateRangePicker
                      value={range}
                      onChange={(next) => handleDateChange(house._id, next)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-blue-600">
                      {house.price} {house.currency || "ETB"}
                    </p>
                    <button
                      onClick={() => handleBook(house)}
                      disabled={loading}
                      className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Booking…" : "Book stay"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Houses;

