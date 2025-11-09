import React from "react";
import { cn } from "./utils";

export const Menubar = ({ className, children }) => (
  <div className={cn("flex items-center rounded-2xl border border-gray-200 bg-white p-2", className)}>
    {children}
  </div>
);

export const MenubarItem = ({ active, className, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800",
      active && "bg-gray-200 text-gray-900 dark:bg-slate-800 dark:text-gray-100",
      className
    )}
  >
    {children}
  </button>
);
