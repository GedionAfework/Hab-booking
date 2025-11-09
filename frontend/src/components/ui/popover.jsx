import React, { useState } from "react";
import { cn } from "./utils";

export const Popover = ({ children }) => <div className="relative inline-flex">{children}</div>;

export const PopoverTrigger = ({ asChild = false, children, onClick }) => {
  if (asChild) return React.cloneElement(children, { onClick });
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export const PopoverContent = ({ open, onOpenChange, className, children }) => {
  if (!open) return null;
  return (
    <div className={cn("absolute z-50 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl", className)}>
      <div>
        {children}
      </div>
      <button type="button" className="mt-3 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100" onClick={() => onOpenChange?.(false)}>
        Close
      </button>
    </div>
  );
};

export const usePopover = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  return { open, setOpen, toggle };
};
