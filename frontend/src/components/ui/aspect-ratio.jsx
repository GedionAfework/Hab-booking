import React from "react";
import { cn } from "./utils";

export const AspectRatio = ({ ratio = 16 / 9, className, children }) => {
  const padding = `${100 / ratio}%`;
  return (
    <div className={cn("relative w-full overflow-hidden", className)} style={{ paddingBottom: padding }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};
