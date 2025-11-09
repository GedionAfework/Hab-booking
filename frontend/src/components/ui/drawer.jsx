import React from "react";
import { cn } from "./utils";

export const Drawer = ({ open, onOpenChange, side = "right", children }) => {
  if (!open) return null;
  const position = side === "left" ? "left-0" : side === "top" ? "top-0" : side === "bottom" ? "bottom-0" : "right-0";
  const sizeClass = side === "top" || side === "bottom" ? "h-1/2 w-full" : "h-full w-80";
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange?.(false)} />
      <div className={cn("absolute bg-white shadow-xl", position, sizeClass)}>{children}</div>
    </div>
  );
};
