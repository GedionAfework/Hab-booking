import React from 'react';
import ListingCard from './ListingCard';
import { Button } from './ui';

export default function MyListings({ houses = [], cars = [], onEdit, onDelete, onToggleHide }) {
  if ((!houses || houses.length === 0) && (!cars || cars.length === 0)) return null;
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">My Listings</h3>
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
              <Button variant="outline" size="sm" onClick={() => onEdit?.(h, 'house')}>
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete?.(h, 'house')}>
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => onToggleHide?.(h, 'house')}>
                {h.hidden ? 'Unhide' : 'Hide'}
              </Button>
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
              <Button variant="outline" size="sm" onClick={() => onEdit?.(c, 'car')}>
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete?.(c, 'car')}>
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => onToggleHide?.(c, 'car')}>
                {c.hidden ? 'Unhide' : 'Hide'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
