import React from "react";

export default function DealCard({ image, title, location, price, rating, badge, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group h-full w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
            No image
          </div>
        )}
        {badge && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg animate-bounce-subtle">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between text-sm md:text-base text-blue-500 dark:text-blue-400">
          <span>{location}</span>
          {rating && (
            <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
              ★
              <span className="text-gray-600 dark:text-gray-300">{rating}</span>
            </span>
          )}
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{title}</h3>
        <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300">Starting from {price}</p>
      </div>
    </button>
  );
}
