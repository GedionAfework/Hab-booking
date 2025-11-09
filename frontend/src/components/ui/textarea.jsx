import React from "react";
import { cn } from "./utils";

const Textarea = React.forwardRef(({ className, rows = 4, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(
      "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export { Textarea };
