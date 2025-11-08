import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services";
import BookingCard from "../components/BookingCard";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast("Login required to view bookings");
          setLoading(false);
          return;
        }
        const res = await API.get("/bookings/my/bookings");
        setBookings(res.data);
      } catch (err) {
        toast(err.response?.data?.message || "Login required to view bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">My Bookings</h2>
        <p className="text-sm text-gray-600">
          Track every reservation you make—see the status, host details, and total amount all in one place.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
          Loading your bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
          You haven’t booked anything yet. Explore houses and cars to make your first reservation.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
