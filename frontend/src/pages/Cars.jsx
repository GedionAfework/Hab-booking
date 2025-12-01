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
import { Form, FormField, Input, Button } from "../components/ui";

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
        <section className="space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Drive your dream ride</h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2">Choose from our premium fleet of vehicles worldwide.</p>
          </div>

          <Form onSubmit={handleSearch} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <FormField label="Pickup location">
                <Input
                  value={query.location}
                  onChange={(e) => setQuery((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Addis Ababa Airport"
                />
              </FormField>
              <FormField label="Pickup date (optional filter)">
                <Input
                  type="date"
                  value={query.pickup}
                  onChange={(e) => setQuery((prev) => ({ ...prev, pickup: e.target.value }))}
                />
              </FormField>
              <FormField label="Return date (optional filter)">
                <Input
                  type="date"
                  value={query.dropoff}
                  onChange={(e) => setQuery((prev) => ({ ...prev, dropoff: e.target.value }))}
                />
              </FormField>
              <div className="flex items-end">
                <Button type="submit" className="inline-flex w-full items-center justify-center gap-2 bg-black text-white hover:bg-gray-800">
                  <IoSearch className="text-lg" />
                  Search cars
                </Button>
              </div>
            </div>
          </Form>
        </section>

        <section className="mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Available vehicles ({filtered.length})</h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2">Pick a ride that matches your plans</p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((car) => {
              const image = resolveImage(car.images?.[0]);
              const pickup = pickupDates[car._id] || "";
              return (
                <div
                  key={car._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
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
                      <p className="text-lg font-bold text-blue-600">
                        {car.price} {car.currency || "ETB"}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => handleBook(car)}
                        disabled={loading}
                        className="border-black text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Booking…" : "Rent now"}
                      </Button>
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

