import React from 'react';
import ListingCard from './ListingCard';

export default function MyListings({ houses = [], cars = [], onEdit, onDelete, onToggleHide }) {
  if ((!houses || houses.length === 0) && (!cars || cars.length === 0)) return null;
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">My Listings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {houses.map(h => (
          <div key={h._id} className="group">
            <ListingCard
              image={h.images?.[0]}
              title={`${h.name} (${h.type})`}
              subtitle={h.location?.city || ''}
              price={h.price}
              currency={h.currency}
            />
            <div className="mt-2 flex gap-2">
              <button className="inline-flex items-center rounded-md bg-amber-500 px-2 py-1 text-xs font-medium text-white hover:bg-amber-400" onClick={() => onEdit?.(h, 'house')}>Edit</button>
              <button className="inline-flex items-center rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-500" onClick={() => onDelete?.(h, 'house')}>Delete</button>
              <button className="inline-flex items-center rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-white hover:bg-slate-600" onClick={() => onToggleHide?.(h, 'house')}>{h.hidden ? 'Unhide' : 'Hide'}</button>
            </div>
          </div>
        ))}
        {cars.map(c => (
          <div key={c._id} className="group">
            <ListingCard
              image={c.images?.[0]}
              title={`${c.make} ${c.model} (${c.year})`}
              subtitle={`${c.fuelType} • ${c.transmission}`}
              price={c.price}
              currency={c.currency}
            />
            <div className="mt-2 flex gap-2">
              <button className="inline-flex items-center rounded-md bg-amber-500 px-2 py-1 text-xs font-medium text-white hover:bg-amber-400" onClick={() => onEdit?.(c, 'car')}>Edit</button>
              <button className="inline-flex items-center rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-500" onClick={() => onDelete?.(c, 'car')}>Delete</button>
              <button className="inline-flex items-center rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-white hover:bg-slate-600" onClick={() => onToggleHide?.(c, 'car')}>{c.hidden ? 'Unhide' : 'Hide'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
