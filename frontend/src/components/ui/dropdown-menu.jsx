import React, { useState } from "react";
import { cn } from "./utils";

export const DropdownMenu = ({ children }) => <div className="relative inline-block">{children}</div>;

export const DropdownMenuTrigger = ({ asChild = false, children, onClick }) => {
  if (asChild) return React.cloneElement(children, { onClick });
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export const DropdownMenuContent = ({ open, onClose, align = "start", className, children }) => {
  if (!open) return null;
  const alignment = align === "end" ? "right-0" : "left-0";
  return (
    <div className={cn("absolute z-50 mt-2 min-w-[180px] rounded-xl border border-gray-200 bg-white shadow-lg", alignment, className)}>
      <div onClick={onClose}>{children}</div>
    </div>
  );
};

export const useDropdown = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);
  return { open, toggle, close };
};
