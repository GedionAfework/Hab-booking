import React from 'react';
import { UPLOADS_BASE } from '../services';

function resolveImage(src) {
  if (!src) return src;
  // Prefix uploads path with server origin if needed
  if (src.startsWith('/uploads')) return `${UPLOADS_BASE}${src}`;
  return src;
}

export default function ListingCard({ image, title, subtitle, price, currency }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow hover:shadow-lg ring-1 ring-gray-200 transition-shadow">
      {image && (
        <div className="relative">
          <img src={resolveImage(image)} alt={title} className="w-full h-48 object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      <div className="p-4">
        <div className="text-base font-semibold text-gray-900">{title}</div>
        {subtitle && <div className="mt-0.5 text-sm text-gray-600">{subtitle}</div>}
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-gray-200">
          <span>{price} {currency}</span>
        </div>
      </div>
    </div>
  );
}


