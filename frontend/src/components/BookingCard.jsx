import React from 'react';
import { UPLOADS_BASE } from '../services';

const statusStyles = {
  pending: 'bg-gray-200 text-gray-700 ring-gray-300 dark:bg-slate-800 dark:text-gray-200',
  confirmed: 'bg-gray-300 text-gray-800 ring-gray-400 dark:bg-slate-700 dark:text-gray-100',
  rejected: 'bg-gray-300 text-gray-800 ring-gray-400 dark:bg-slate-700 dark:text-gray-100',
};

const statusLabels = {
  pending: 'Pending approval',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
};

const resolveImage = (listing) => {
  const src = listing?.images?.[0];
  if (!src) return null;
  return src.startsWith('/uploads') ? `${UPLOADS_BASE}${src}` : src;
};

const formatTitle = (booking) => {
  if (!booking.listing) return `${booking.listingType} booking`;
  if (booking.listingType === 'house') {
    return `${booking.listing.name} (${booking.listing.type})`;
  }
  if (booking.listingType === 'car') {
    return `${booking.listing.make} ${booking.listing.model}`;
  }
  return 'Flight booking';
};

const formatSubtitle = (booking) => {
  if (!booking.listing) return null;
  if (booking.listingType === 'house') {
    const details = [];
    if (booking.listing.location?.city) details.push(booking.listing.location.city);
    if (booking.listing.bedroom) details.push(`${booking.listing.bedroom} bd`);
    if (booking.listing.bathroom) details.push(`${booking.listing.bathroom} ba`);
    return details.join(' • ');
  }
  if (booking.listingType === 'car') {
    const details = [];
    if (booking.listing.year) details.push(booking.listing.year);
    if (booking.listing.fuelType) details.push(booking.listing.fuelType);
    if (booking.listing.transmission) details.push(booking.listing.transmission);
    return details.join(' • ');
  }
  return null;
};

const formatDate = (date) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return '';
  }
};

export default function BookingCard({ booking }) {
  const image = resolveImage(booking.listing);
  const statusClass = statusStyles[booking.status] || 'bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-700 dark:text-slate-200';
  const statusText = statusLabels[booking.status] || booking.status;
  const title = formatTitle(booking);
  const subtitle = formatSubtitle(booking);
  const created = formatDate(booking.createdAt);
  const currency = booking.listing?.currency || booking.currency || 'ETB';

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg dark:border-gray-800 dark:bg-slate-900">
      <div className="relative h-48 w-full bg-gray-100 dark:bg-slate-800">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            No cover image
          </div>
        )}
        <span className={`absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass}`}>
          {statusText}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="font-medium text-gray-900 dark:text-gray-100">Total: {booking.totalPrice} {currency}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Booked on {created || '—'}</div>
        </div>
        {booking.listing?.owner && (
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-slate-800 dark:text-gray-300">
            Host: <span className="font-medium text-gray-800 dark:text-gray-100">{booking.listing.owner.name}</span> · {booking.listing.owner.email}
          </div>
        )}
      </div>
    </article>
  );
}
