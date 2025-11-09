import React, { useState } from "react";
import { cn } from "./utils";

const Tooltip = ({ content, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open && (
        <span className={cn("absolute left-1/2 z-20 -translate-x-1/2 -translate-y-2 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs text-white shadow")}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export { Tooltip };
