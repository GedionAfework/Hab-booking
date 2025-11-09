import React, { useMemo, useState } from "react";
import { cn } from "./utils";

export const Command = ({ items = [], onSelect, placeholder = "Search...", emptyMessage = "No results" }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(lower));
  }, [items, query]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
      <input
        className="w-full rounded-t-2xl border-b border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="max-h-60 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-500">{emptyMessage}</p>
        ) : (
          filtered.map((item) => (
            <button
              key={item.value}
              type="button"
              className={cn(
                "flex w-full items-center justify-start gap-2 px-4 py-2 text-left text-sm hover:bg-blue-50",
                item.className
              )}
              onClick={() => onSelect?.(item.value)}
            >
              {item.icon && <span className="text-gray-500">{item.icon}</span>}
              <span className="text-gray-700">{item.label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
