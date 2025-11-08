import React from 'react';

const formatTime = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

export default function FlightCard({ flight, onBook, travelDate }) {
  return (
    <article className="rounded-2xl border border-indigo-100 bg-white shadow-sm ring-1 ring-indigo-50 transition hover:shadow-xl">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-indigo-500">{flight.flightNumber || 'Flight'}</p>
            <h3 className="text-xl font-semibold text-gray-900">{flight.airline}</h3>
          </div>
          <div className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            {flight.price ? `${flight.price} ${flight.currency || 'USD'}` : 'Contact for price'}
          </div>
        </div>

        {travelDate && (
          <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600">
            Traveling on {travelDate}
          </div>
        )}

        <div className="grid gap-3 rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-white p-4 text-sm text-gray-600 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-500">Departure</p>
            <p className="text-sm font-medium text-gray-900">{flight.origin}</p>
            <p>{formatTime(flight.departureTime)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-500">Arrival</p>
            <p className="text-sm font-medium text-gray-900">{flight.destination}</p>
            <p>{formatTime(flight.arrivalTime)}</p>
          </div>
          {flight.durationMinutes && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-indigo-500">Duration</p>
              <p>{Math.round(flight.durationMinutes)} minutes</p>
            </div>
          )}
        </div>

        <button
          onClick={() => onBook?.(flight)}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        >
          Book this flight
        </button>
      </div>
    </article>
  );
}
