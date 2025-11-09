import React from "react";
import { cn } from "./utils";

const Switch = React.forwardRef(({ className, checked, onChange, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange?.(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition",
      checked ? "bg-blue-600" : "bg-gray-300",
      className
    )}
    {...props}
  >
    <span
      className={cn(
      "inline-block h-5 w-5 transform rounded-full bg-white transition",
      checked ? "translate-x-5" : "translate-x-1"
    )}
    />
  </button>
));

Switch.displayName = "Switch";

export { Switch };
