import React from "react";
import { cn } from "./utils";

export const Toggle = ({ pressed, onPressedChange, className, children }) => (
  <button
    type="button"
    onClick={() => onPressedChange?.(!pressed)}
    className={cn(
      "inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm transition",
      pressed ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-100",
      className
    )}
  >
    {children}
  </button>
);
