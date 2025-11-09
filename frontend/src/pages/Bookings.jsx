import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../services";
import {
  IoAirplaneOutline,
  IoHomeOutline,
  IoCarSportOutline,
  IoCalendarOutline,
  IoTimeOutline,
} from "react-icons/io5";

const typeIcon = {
  flight: <IoAirplaneOutline className="text-lg" />,
  house: <IoHomeOutline className="text-lg" />,
  car: <IoCarSportOutline className="text-lg" />,
};

const statusClasses = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-green-50 text-green-600",
  completed: "bg-blue-50 text-blue-600",
  rejected: "bg-rose-50 text-rose-600",
  cancelled: "bg-rose-50 text-rose-600",
};

const tabLabels = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

const formatDate = (value) => {
  if (!value) return "Date TBD";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

const Bookings = () => {
  const [tab, setTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await API.get("/bookings/my/bookings");
        setBookings(res.data || []);
      } catch (err) {
        toast(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const grouped = useMemo(() => {
    const today = new Date();
    const upcoming = [];
    const past = [];
    const cancelled = [];

    bookings.forEach((booking) => {
      const status = booking.status || "pending";
      const startDate = booking.startDate ? new Date(booking.startDate) : null;
      if (status === "rejected" || status === "cancelled") {
        cancelled.push(booking);
      } else if (startDate && startDate < today) {
        past.push(booking);
      } else {
        upcoming.push(booking);
      }
    });

    return { upcoming, past, cancelled };
  }, [bookings]);

  const current = grouped[tab] || [];

  const renderListingTitle = (booking) => {
    if (booking.listingType === "flight") {
      return booking.flightInfo?.route || booking.flightInfo?.title || "Flight booking";
    }
    const listing = booking.listing;
    if (!listing) return "Booking";
    if (booking.listingType === "house") {
      return listing.name || "House stay";
    }
    if (booking.listingType === "car") {
      return listing.name || `${listing.make || "Car"} ${listing.model || "rental"}`;
    }
    return "Booking";
  };

  const renderPrice = (booking) => {
    if (booking.totalPrice) return `$${booking.totalPrice}`;
    if (booking.flightInfo?.price) return `$${booking.flightInfo.price}`;
    return "—";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My bookings</h1>
          <p className="text-sm text-gray-500">Manage and review your upcoming trips in one place.</p>
        </header>

        <div className="mb-6 inline-flex rounded-full bg-white p-1 shadow-sm">
          {tabLabels.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === key ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white bg-white p-12 text-center text-gray-500 shadow-sm">
            Loading bookings…
          </div>
        ) : current.length === 0 ? (
          <div className="rounded-2xl border border-white bg-white p-12 text-center text-gray-500 shadow-sm">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-4">
            {current.map((booking) => (
              <div key={booking._id} className="rounded-2xl border border-white bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                      {typeIcon[booking.listingType] || <IoAirplaneOutline className="text-lg" />}
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{renderListingTitle(booking)}</h3>
                        <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${statusClasses[booking.status] || "bg-gray-100 text-gray-600"}`}>
                          {booking.status || "pending"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                          <IoCalendarOutline />
                          {formatDate(booking.startDate)}
                          {booking.endDate && booking.endDate !== booking.startDate && ` – ${formatDate(booking.endDate)}`}
                        </span>
                        {booking.createdAt && (
                          <span className="flex items-center gap-2">
                            <IoTimeOutline />
                            Booked on {formatDate(booking.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-xl font-bold text-blue-600">{renderPrice(booking)}</p>
                    <button className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
                      View details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
