import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services";

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const res = await API.get(`/bookings/${id}`);
      setBooking(res.data);
    };
    fetchBooking();
  }, [id]);

  if (!booking) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-3">Booking Details</h1>
      <p><strong>Item:</strong> {booking.itemName}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <p><strong>Date:</strong> {new Date(booking.date).toLocaleString()}</p>
    </div>
  );
};

export default BookingDetails;
