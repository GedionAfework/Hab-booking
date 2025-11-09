import React from "react";
import { cn } from "./utils";

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100",
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";

export { Select };
