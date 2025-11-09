import React from "react";
import { cn } from "./utils";

export const RadioGroup = ({ value, onChange, options = [], className }) => (
  <div className={cn("flex flex-col gap-2", className)}>
    {options.map((option) => (
      <label key={option.value} className="inline-flex items-center gap-2 text-sm text-gray-600">
        <input
          type="radio"
          name="radio-group"
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange?.(option.value)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-200"
        />
        {option.label}
      </label>
    ))}
  </div>
);
