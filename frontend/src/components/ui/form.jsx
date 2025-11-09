import React from "react";
import { cn } from "./utils";

export const FormField = ({ className, label, helper, error, children }) => (
  <div className={cn("space-y-1", className)}>
    {label && <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>}
    {children}
    {helper && <p className="text-xs text-gray-400 dark:text-gray-500">{helper}</p>}
    {error && <p className="text-xs text-gray-700 dark:text-gray-300">{error}</p>}
  </div>
);

export const Form = ({ onSubmit, children, className }) => (
  <form onSubmit={onSubmit} className={className}>
    {children}
  </form>
);
