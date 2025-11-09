import React from "react";
import { cn } from "./utils";

export const Toggle = ({ pressed, onPressedChange, className, children }) => (
  <button
    type="button"
    onClick={() => onPressedChange?.(!pressed)}
    className={cn(
      "inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm transition",
      pressed ? "border-gray-600 bg-gray-200 text-gray-800 dark:border-gray-400 dark:bg-slate-800 dark:text-gray-100" : "border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-slate-800",
      className
    )}
  >
    {children}
  </button>
);
