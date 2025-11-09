import React from "react";
import { cn } from "./utils";

export const Chart = ({ title, description, children, className }) => (
  <div className={cn("rounded-2xl border border-gray-200 bg-white p-4", className)}>
    {(title || description) && (
      <div className="mb-4 space-y-1">
        {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    )}
    <div className="h-40 w-full rounded-xl bg-blue-50 text-center text-sm text-blue-600">
      {children || "Chart placeholder"}
    </div>
  </div>
);
