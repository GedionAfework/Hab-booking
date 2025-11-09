import React from "react";
import { cn } from "./utils";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-700",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
