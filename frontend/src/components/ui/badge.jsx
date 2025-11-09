import React from "react";
import { cn } from "./utils";

const variants = {
  default: "bg-gray-900 text-white",
  secondary: "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-200",
  outline: "border border-gray-400 text-gray-700 dark:border-gray-500 dark:text-gray-200",
  subtle: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300",
};

const Badge = ({ className, variant = "default", ...props }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      variants[variant] || variants.default,
      className
    )}
    {...props}
  />
);

export { Badge };
