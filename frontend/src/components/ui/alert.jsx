import React from "react";
import { cn } from "./utils";

const variants = {
  default: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  destructive: "bg-rose-50 text-rose-700 border-rose-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
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
