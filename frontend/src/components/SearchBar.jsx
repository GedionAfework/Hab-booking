import React, { useMemo, useState } from "react";
import {
  IoAirplaneOutline,
  IoHomeOutline,
  IoCarSportOutline,
  IoSearch,
  IoPeopleOutline,
} from "react-icons/io5";
import { DateRangePicker, SingleDatePicker } from "./DateRangePicker";
import { Tabs, TabsList, TabsTrigger, Button, Input, Label } from "./ui";

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
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 md:p-10 shadow-2xl">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-8 flex w-full gap-3">
          {tabConfig.map(({ key, label, icon }) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex flex-1 items-center justify-center gap-3 rounded-full px-6 py-4 text-lg md:text-xl font-semibold"
            >
              <span className="text-2xl">{icon}</span>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Label className="flex flex-col gap-3 text-lg md:text-xl font-semibold">
            From
            <Input
              value={route.from}
              onChange={(e) => setRoute((prev) => ({ ...prev, from: e.target.value }))}
              placeholder="Origin city"
              required
              className="text-lg md:text-xl py-4 px-4"
            />
          </Label>
          <Label className="flex flex-col gap-3 text-lg md:text-xl font-semibold">
            To
            <Input
              value={route.to}
              onChange={(e) => setRoute((prev) => ({ ...prev, to: e.target.value }))}
              placeholder="Destination"
              required
              className="text-lg md:text-xl py-4 px-4"
            />
          </Label>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
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
          <Label className="flex flex-col gap-3 text-lg md:text-xl font-semibold">
            Guests
            <div className="flex items-center gap-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 px-5 py-4 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <IoPeopleOutline className="text-blue-500 text-2xl" />
              <Input
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="border-none px-0 py-0 focus:ring-0 text-lg md:text-xl bg-transparent dark:bg-transparent"
              />
            </div>
          </Label>
        </div>

        <Button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 text-lg md:text-xl font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 hover:scale-105"
        >
          <IoSearch className="text-2xl" />
          Search {tab}
        </Button>
      </div>
    </form>
  );
}
