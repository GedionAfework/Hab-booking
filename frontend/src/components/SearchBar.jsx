import React, { useMemo, useState } from "react";
import {
  IoAirplaneOutline,
  IoHomeOutline,
  IoCarSportOutline,
  IoSearch,
  IoPeopleOutline,
} from "react-icons/io5";
import { DateRangePicker, SingleDatePicker } from "./DateRangePicker";

const todayISO = () => new Date().toISOString().split("T")[0];

const tabConfig = [
  { key: "flights", label: "Flights", icon: <IoAirplaneOutline /> },
  { key: "houses", label: "Houses", icon: <IoHomeOutline /> },
  { key: "cars", label: "Cars", icon: <IoCarSportOutline /> },
];

export default function SearchBar({ onSearch }) {
  const [tab, setTab] = useState("flights");
  const [route, setRoute] = useState({ from: "Addis Ababa", to: "Nairobi" });
  const [range, setRange] = useState({ start: todayISO(), end: todayISO() });
  const [singleDate, setSingleDate] = useState(todayISO());
  const [guests, setGuests] = useState("2 adults");

  const minDate = useMemo(() => todayISO(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        type: tab,
        from: route.from,
        to: route.to,
        startDate: tab === "cars" ? singleDate : range.start,
        endDate: tab === "cars" ? singleDate : range.end,
        guests,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl rounded-3xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur">
      <div className="mb-6 flex gap-2 rounded-full bg-gray-100 p-1 text-sm font-semibold">
        {tabConfig.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 transition ${
              tab === key ? "bg-white text-blue-600 shadow" : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            From
            <input
              value={route.from}
              onChange={(e) => setRoute((prev) => ({ ...prev, from: e.target.value }))}
              placeholder="Origin city"
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            To
            <input
              value={route.to}
              onChange={(e) => setRoute((prev) => ({ ...prev, to: e.target.value }))}
              placeholder="Destination"
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          {tab === "cars" ? (
            <SingleDatePicker
              value={singleDate}
              onChange={setSingleDate}
              min={minDate}
              label="Rental date"
            />
          ) : (
            <DateRangePicker value={range} onChange={setRange} min={minDate} />
          )}
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Guests
            <div className="mt-1 flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <IoPeopleOutline className="text-blue-500" />
              <input
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full border-none bg-transparent text-sm font-medium text-gray-700 outline-none"
              />
            </div>
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-500 hover:to-indigo-500"
        >
          <IoSearch className="text-lg" />
          Search {tab}
        </button>
      </div>
    </form>
  );
}
