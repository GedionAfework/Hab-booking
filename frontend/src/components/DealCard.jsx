import React from "react";

export default function DealCard({ image, title, location, price, rating, badge, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group h-full w-full overflow-hidden rounded-2xl border border-orange-200 bg-orange-100 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-slate-900"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500 dark:bg-slate-800 dark:text-gray-400">
            No image
          </div>
        )}
        {badge && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold text-white shadow dark:bg-white dark:text-black">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{location}</span>
          {rating && (
            <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              ★
              <span>{rating}</span>
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Starting from {price}</p>
      </div>
    </button>
  );
}
