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
    <article className="rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-xl dark:border-gray-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{flight.flightNumber || 'Flight'}</p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{flight.airline}</h3>
          </div>
          <div className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-gray-200">
            {flight.price ? `${flight.price} ${flight.currency || 'USD'}` : 'Contact for price'}
          </div>
        </div>

        {travelDate && (
          <div className="rounded-xl bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-gray-200">
            Traveling on {travelDate}
          </div>
        )}

        <div className="grid gap-3 rounded-2xl border border-gray-200 p-4 text-sm text-gray-600 sm:grid-cols-2 dark:border-gray-700 dark:text-gray-300">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Departure</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{flight.origin}</p>
            <p>{formatTime(flight.departureTime)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Arrival</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{flight.destination}</p>
            <p>{formatTime(flight.arrivalTime)}</p>
          </div>
          {flight.durationMinutes && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Duration</p>
              <p>{Math.round(flight.durationMinutes)} minutes</p>
            </div>
          )}
        </div>

        <button
          onClick={() => onBook?.(flight)}
          className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Book this flight
        </button>
      </div>
    </article>
  );
}
