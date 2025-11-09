import React from "react";
import { cn } from "./utils";

export const Separator = ({ className, orientation = "horizontal" }) => (
  <div
    className={cn(
      orientation === "vertical" ? "h-full w-px bg-gray-200" : "h-px w-full bg-gray-200",
      className
    )}
    role="separator"
  />
);
