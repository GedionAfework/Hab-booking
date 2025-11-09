import React from "react";
import { cn } from "./utils";

export const Breadcrumb = ({ className, children }) => (
  <nav className={cn("flex items-center gap-2 text-sm text-gray-500", className)} aria-label="Breadcrumb">
    {children}
  </nav>
);

export const BreadcrumbItem = ({ className, children }) => (
  <span className={cn("inline-flex items-center gap-2", className)}>{children}</span>
);

export const BreadcrumbLink = ({ className, href = "#", children }) => (
  <a className={cn("text-gray-600 hover:underline dark:text-gray-300", className)} href={href}>
    {children}
  </a>
);

export const BreadcrumbSeparator = ({ className, children = "/" }) => (
  <span className={cn("text-gray-400", className)}>{children}</span>
);
