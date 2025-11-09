import React from "react";
import { cn } from "./utils";

export const Progress = ({ value = 0, className }) => (
  <div className={cn("h-2 w-full rounded-full bg-gray-200", className)}>
    <div
      className="h-full rounded-full bg-blue-600 transition-all"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);
