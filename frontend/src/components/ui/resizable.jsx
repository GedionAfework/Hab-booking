import React, { useState } from "react";
import { cn } from "./utils";

export const ResizablePanel = ({ initialWidth = 300, minWidth = 200, maxWidth = 600, className, children }) => {
  const [width, setWidth] = useState(initialWidth);

  const handleDrag = (event) => {
    const next = Math.min(Math.max(event.clientX, minWidth), maxWidth);
    setWidth(next);
  };

  return (
    <div className={cn("relative flex", className)} style={{ width }}>
      <div className="flex-1 overflow-auto">{children}</div>
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent"
        onMouseDown={(event) => {
          event.preventDefault();
          const handleMouseMove = (moveEvent) => handleDrag(moveEvent);
          const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
          };
          window.addEventListener("mousemove", handleMouseMove);
          window.addEventListener("mouseup", handleMouseUp);
        }}
      />
    </div>
  );
};
