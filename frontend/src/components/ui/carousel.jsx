import React, { useRef } from "react";
import { cn } from "./utils";

export const Carousel = ({ className, children }) => {
  const containerRef = useRef(null);

  const scrollBy = (offset) => {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow"
        onClick={() => scrollBy(-200)}
      >
        ◀
      </button>
      <div ref={containerRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-4">
        {children}
      </div>
      <button
        type="button"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow"
        onClick={() => scrollBy(200)}
      >
        ▶
      </button>
    </div>
  );
};
