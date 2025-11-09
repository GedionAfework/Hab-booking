import React from 'react';
import { IoCalendarOutline, IoCarSportOutline, IoHomeOutline } from 'react-icons/io5';
import { UPLOADS_BASE } from '../services';
import DateRangePicker, { SingleDatePicker } from './DateRangePicker';
import { Button } from './ui';

const resolveImage = (src) => {
  if (!src) return src;
  return src.startsWith('/uploads') ? `${UPLOADS_BASE}${src}` : src;
};

const formatHouseInfo = (house) => {
  const parts = [];
  if (house.bedroom) parts.push(`${house.bedroom} bd`);
  if (house.bathroom) parts.push(`${house.bathroom} ba`);
  if (house.size) parts.push(`${house.size} ${house.sizeStandard || 'sqm'}`);
  return parts.join(' • ');
};

const formatCarInfo = (car) => {
  const parts = [];
  if (car.year) parts.push(car.year);
  if (car.fuelType) parts.push(car.fuelType);
  if (car.transmission) parts.push(car.transmission);
  return parts.join(' • ');
};

export default function AvailableListings({
  title,
  listings = [],
  variant = 'house',
  bookingDates = {},
  setBookingDates,
  onBook,
}) {
  const handleRangeChange = (id, range) => {
    if (!setBookingDates) return;
    setBookingDates((prev) => ({ ...prev, [id]: range }));
  };

  const handleSingleChange = (id, date) => {
    if (!setBookingDates) return;
    setBookingDates((prev) => ({ ...prev, [id]: date }));
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {title && <h2 className="text-3xl font-semibold tracking-tight text-gray-900">{title}</h2>}
      {listings.length === 0 ? (
        <p className="text-sm text-gray-500">No listings available right now.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((item) => {
            const cover = resolveImage(item.images?.[0]);
            const thumbnails = (item.images || []).slice(1, 4).map(resolveImage);
            const priceLabel = `${item.price} ${item.currency || 'ETB'}`;
            const info =
              variant === 'house'
                ? formatHouseInfo(item)
                : formatCarInfo(item);
            const titleText =
              variant === 'house'
                ? `${item.name} (${item.type})`
                : `${item.make} ${item.model}${item.year ? ` (${item.year})` : ''}`;

            const value = bookingDates[item._id] || (variant === 'house' ? { start: '', end: '' } : '');
            const isHouse = variant === 'house';

            const buttonLabel = isHouse
              ? value.start && value.end
                ? 'Book these dates'
                : 'Select check-in and check-out'
              : value
              ? 'Book this date'
              : 'Select a booking date';
            const ButtonIcon = isHouse ? IoHomeOutline : IoCarSportOutline;

            return (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-slate-900"
              >
                <div className="relative h-56 w-full">
                  {cover ? (
                    <img src={cover} alt={titleText} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-sm font-medium text-white">
                    {priceLabel}
                  </div>
                </div>
                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{titleText}</h3>
                    {item.location?.city && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.location.city}</p>
                    )}
                    {info && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{info}</p>}
                  </div>

                  {isHouse ? (
                    <DateRangePicker
                      value={value}
                      onChange={(next) => handleRangeChange(item._id, next)}
                      min={minDate}
                      variant="default"
                    />
                  ) : (
                    <SingleDatePicker
                      value={value}
                      onChange={(next) => handleSingleChange(item._id, next)}
                      min={minDate}
                      label="Rental date"
                    />
                  )}

                  {thumbnails.length > 0 && (
                    <div className="flex gap-2">
                      {thumbnails.map((thumb, idx) => (
                        <img
                          key={idx}
                          src={thumb}
                          alt="thumbnail"
                          className="h-14 w-14 rounded-md object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                        />
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => onBook?.(item, value)}
                    className="inline-flex w-full items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    disabled={isHouse ? !value.start || !value.end : !value}
                  >
                    <ButtonIcon className="text-lg" />
                    {buttonLabel}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


