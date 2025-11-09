import React from "react";
import { cn } from "./utils";

const styles = {
  default: "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200",
  outline: "border border-gray-400 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-slate-800",
  ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800",
  destructive: "border border-gray-700 text-gray-800 hover:bg-gray-200 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-slate-800",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

const Button = React.forwardRef(({ className, variant = "default", size = "md", type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-gray-700",
      styles[variant] || styles.default,
      sizes[size] || sizes.md,
      className
    )}
    {...props}
  />
));

Button.displayName = "Button";

export { Button };
