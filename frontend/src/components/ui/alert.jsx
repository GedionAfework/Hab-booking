import React from "react";
import { cn } from "./utils";

const variants = {
  default: "bg-gray-100 text-gray-700 border-gray-300",
  success: "bg-gray-100 text-gray-700 border-gray-300",
  destructive: "bg-gray-100 text-gray-700 border-gray-300",
  warning: "bg-gray-100 text-gray-700 border-gray-300",
};

export const Alert = ({ className, variant = "default", title, children, actions }) => (
  <div
    className={cn(
      "flex items-start gap-3 rounded-2xl border p-4 text-sm",
      variants[variant] || variants.default,
      className
    )}
  >
    <div className="flex-1 space-y-1">
      {title && <p className="font-semibold">{title}</p>}
      {children && <div>{children}</div>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);
