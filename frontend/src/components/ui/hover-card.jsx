import React, { useState } from "react";
import { cn } from "./utils";

export const HoverCard = ({ className, children, content }) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div className={cn("absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg", className)}>
          {content}
        </div>
      )}
    </span>
  );
};
