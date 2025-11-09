import React from "react";
import { cn } from "./utils";

export const Checkbox = React.forwardRef(({ className, checked, onChange, ...props }, ref) => (
  <label className="inline-flex items-center gap-2 text-sm text-gray-600">
    <input
      ref={ref}
      type="checkbox"
      className={cn("h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-200", className)}
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      {...props}
    />
    {props.label && <span>{props.label}</span>}
  </label>
));

Checkbox.displayName = "Checkbox";
