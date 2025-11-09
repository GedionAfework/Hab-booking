import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API, { UPLOADS_BASE } from "../services";
import {
  IoSearch,
  IoPeopleOutline,
  IoCogOutline,
  IoWaterOutline,
  IoCarSportOutline,
} from "react-icons/io5";
import { SingleDatePicker } from "../components/DateRangePicker";

const resolveImage = (src) => {
  if (!src) return src;
  return src.startsWith("/uploads") ? `${UPLOADS_BASE}${src}` : src;
};

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [pickupDates, setPickupDates] = useState({});
  const [query, setQuery] = useState({ location: "", pickup: "", dropoff: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await API.get("/cars");
        setCars(res.data);
        setFiltered(res.data);
      } catch (err) {
        toast(err.response?.data?.message || "Failed to load cars");
      }
    };
    fetchCars();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = cars.filter((car) => {
      const matchesLocation = query.location
        ? [car.location?.city, car.location?.country, car.make, car.model]
            .filter(Boolean)
            .some((val) => val.toLowerCase().includes(query.location.toLowerCase()))
        : true;
      return matchesLocation;
    });
    setFiltered(next);
  };

  const handleDateChange = (id, date) => {
    setPickupDates((prev) => ({ ...prev, [id]: date }));
  };

  const handleBook = async (car) => {
    const date = pickupDates[car._id];
    if (!date) {
      toast("Select a pickup date first");
      return;
    }
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!currentUser || !token) {
      toast("You must be logged in to book a car.");
      return;
    }
    try {
      setLoading(true);
      await API.post("/bookings", {
        listingType: "car",
        listingId: car._id,
        totalPrice: car.price,
        startDate: date,
        endDate: date,
      });
      toast("Car booked successfully");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to book car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Drive your dream ride</h1>
            <p className="text-sm text-gray-500">Choose from our premium fleet of vehicles worldwide.</p>
          </div>

          <form onSubmit={handleSearch} className="rounded-3xl border border-white bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pickup location
                <input
                  value={query.location}
                  onChange={(e) => setQuery((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Addis Ababa Airport"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pickup date (optional filter)
                <input
                  type="date"
                  value={query.pickup}
                  onChange={(e) => setQuery((prev) => ({ ...prev, pickup: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Return date (optional filter)
                <input
                  type="date"
                  value={query.dropoff}
                  onChange={(e) => setQuery((prev) => ({ ...prev, dropoff: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow hover:from-blue-500 hover:to-indigo-500">
                <IoSearch className="text-lg" />
                Search cars
              </button>
            </div>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900">Available vehicles ({filtered.length})</h2>
          <p className="text-sm text-gray-500">Pick a ride that matches your plans</p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((car) => {
              const image = resolveImage(car.images?.[0]);
              const pickup = pickupDates[car._id] || "";
              return (
                <div
                  key={car._id}
                  className="overflow-hidden rounded-2xl border border-white bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    {image ? (
                      <img src={image} alt={car.name || `${car.make} ${car.model}`} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {car.name || `${car.make} ${car.model}`}
                        </h3>
                        <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                          {car.type || car.category || "Vehicle"}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        <IoCarSportOutline /> Premium
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-500">
                      {car.seats && (
                        <div className="flex items-center gap-2">
                          <IoPeopleOutline className="text-blue-500" /> {car.seats} seats
                        </div>
                      )}
                      {car.transmission && (
                        <div className="flex items-center gap-2">
                          <IoCogOutline className="text-blue-500" /> {car.transmission}
                        </div>
                      )}
                      {car.fuelType && (
                        <div className="flex items-center gap-2">
                          <IoWaterOutline className="text-blue-500" /> {car.fuelType}
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                      <SingleDatePicker
                        value={pickup}
                        onChange={(next) => handleDateChange(car._id, next)}
                        min={new Date().toISOString().split("T")[0]}
                        label="Rental date"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-blue-600">
                        {car.price} {car.currency || "ETB"}
                      </p>
                      <button
                        onClick={() => handleBook(car)}
                        disabled={loading}
                        className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Booking…" : "Rent now"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cars;

