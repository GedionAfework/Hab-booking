import React from "react";
import { cn } from "./utils";

export const Calendar = ({ className, value, onChange, min }) => (
  <input
    className={cn(
      "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200",
      className
    )}
    type="date"
    value={value || ""}
    min={min}
    onChange={(e) => onChange?.(e.target.value)}
  />
);
