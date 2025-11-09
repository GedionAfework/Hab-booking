import React from "react";
import { cn } from "./utils";

export const NavigationMenu = ({ className, children }) => (
  <div className={cn("flex items-center gap-2", className)}>{children}</div>
);

export const NavigationMenuItem = ({ className, children }) => (
  <div className={cn("relative", className)}>{children}</div>
);

export const NavigationMenuLink = ({ className, href = "#", children }) => (
  <a className={cn("rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800", className)} href={href}>
    {children}
  </a>
);
