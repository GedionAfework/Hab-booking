import React from "react";
import { cn } from "./utils";

const variants = {
  default: "bg-blue-600 text-white",
  secondary: "bg-gray-200 text-gray-700",
  outline: "border border-gray-300 text-gray-600",
  destructive: "bg-rose-600 text-white",
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
