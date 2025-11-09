import React from "react";
import { cn } from "./utils";

export const ScrollArea = ({ className, children, height = "200px" }) => (
  <div className={cn("overflow-y-auto", className)} style={{ maxHeight: height }}>
    {children}
  </div>
);
