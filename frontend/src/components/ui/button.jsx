import React from "react";
import { cn } from "./utils";

const styles = {
  default: "bg-blue-600 text-white hover:bg-blue-500",
  outline: "border border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600",
  ghost: "text-gray-600 hover:bg-gray-100",
  destructive: "bg-rose-600 text-white hover:bg-rose-500",
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
      "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60",
      styles[variant] || styles.default,
      sizes[size] || sizes.md,
      className
    )}
    {...props}
  />
));

Button.displayName = "Button";

export { Button };
