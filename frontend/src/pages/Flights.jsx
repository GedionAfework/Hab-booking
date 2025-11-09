import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../services";
import {
  IoSearch,
  IoAirplaneOutline,
  IoTimeOutline,
  IoArrowForwardOutline,
  IoPricetagOutline,
} from "react-icons/io5";
import { Form, FormField, Input, Button, Select } from "../components/ui";

const todayISO = () => new Date().toISOString().split("T")[0];

const formatPrice = (value = 0, currency = "USD") => {
  if (typeof value === "string" && value.startsWith("$")) return value;
  return `${currency === "USD" ? "$" : ""}${value}`;
};

const Flights = () => {
  const [filters, setFilters] = useState({ origin: "ADD", destination: "NBO", date: todayISO() });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sort, setSort] = useState("best");

  const handleFetchFlights = async (e) => {
    e?.preventDefault();
    if (!filters.origin || !filters.destination || !filters.date) {
      toast("Provide origin, destination, and date");
      return;
    }
    try {
      setLoading(true);
      const res = await API.get("/flights/search", {
        params: {
          origin: filters.origin,
          destination: filters.destination,
          date: filters.date,
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

  const filteredFlights = useMemo(() => {
    if (!flights.length) return [];
    const list = flights.filter((flight) => {
      const price = flight.price || (typeof flight.totalPrice === "number" ? flight.totalPrice : 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    const sorted = [...list];
    if (sort === "cheap") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "fast") {
      const getDuration = (flight) => flight.durationMinutes || parseInt(flight.duration, 10) || 0;
      sorted.sort((a, b) => getDuration(a) - getDuration(b));
    }
    return sorted;
  }, [flights, priceRange, sort]);

  const handleBook = async (flight) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!currentUser || !token) {
      toast("You must be logged in to book a flight.");
      return;
    }
    if (!filters.date) {
      toast("Select a travel date before booking");
      return;
    }
    try {
      await API.post("/bookings", {
        listingType: "flight",
        listingId: flight.id || flight._id,
        totalPrice: flight.price || 0,
        flightInfo: flight,
        startDate: filters.date,
        endDate: filters.date,
      });
      toast("Flight booked successfully!");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to book flight. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[280px,1fr]">
        <aside className="space-y-6">
          <Form onSubmit={handleFetchFlights} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Search flights</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Plan your perfect route</p>
            <div className="mt-4 space-y-3">
              <FormField label="From (IATA)">
                <Input
                  value={filters.origin}
                  onChange={(e) => setFilters((prev) => ({ ...prev, origin: e.target.value.toUpperCase().slice(0, 3) }))}
                  placeholder="ADD"
                  required
                />
              </FormField>
              <FormField label="To (IATA)">
                <Input
                  value={filters.destination}
                  onChange={(e) => setFilters((prev) => ({ ...prev, destination: e.target.value.toUpperCase().slice(0, 3) }))}
                  placeholder="NBO"
                  required
                />
              </FormField>
              <FormField label="Date">
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </FormField>
              <Button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 bg-black text-white hover:bg-gray-800"
              >
                <IoSearch className="text-lg" />
                {loading ? "Searching…" : "Search flights"}
              </Button>
            </div>
          </Form>

          <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Price range</h3>
              <div className="mt-3">
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={50}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Stops</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {['Non-stop', '1 stop', '2+ stops'].map((label) => (
                  <label key={label} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Airlines</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {['Air France', 'Emirates', 'British Airways'].map((label) => (
                  <label key={label} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Flights</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredFlights.length ? `${filteredFlights.length} flights found for your search` : flights.length ? "No flights match filters" : "Search to view flights"}
              </p>
            </div>
            <Select
              className="w-full max-w-[200px]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="best">Best</option>
              <option value="cheap">Cheapest</option>
              <option value="fast">Fastest</option>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <div key={`${flight.airline}-${flight.departureTime || flight.departure}`} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-slate-900">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      <IoAirplaneOutline className="text-lg" />
                      {flight.airline || "Unknown airline"}
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-gray-200">
                        {flight.stops || flight.durationLabel || "Non-stop"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{flight.departureTime || flight.departure || "—"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{flight.origin || flight.from || "—"}</p>
                      </div>
                      <div className="flex flex-1 items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                        <div className="flex flex-col items-center gap-1">
                          <IoTimeOutline />
                          <span>{flight.durationMinutes ? `${flight.durationMinutes} min` : flight.duration || "—"}</span>
                        </div>
                        <IoArrowForwardOutline />
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{flight.arrivalTime || flight.arrival || "—"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{flight.destination || flight.to || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-slate-800 dark:text-gray-200">
                      <IoPricetagOutline />
                      {formatPrice(flight.price, flight.currency)}
                    </span>
                    <button
                      onClick={() => handleBook(flight)}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-500 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-800"
                    >
                      Book flight
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Flights;
