import React, { useState } from "react";
import { cn } from "./utils";

export const ContextMenu = ({ items = [], children }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setOpen(true);
  };

  const closeMenu = () => setOpen(false);

  return (
    <div onContextMenu={handleContextMenu} className="relative">
      {children}
      {open && (
        <ul
          style={{ top: position.y, left: position.x }}
          className={cn(
            "fixed z-50 min-w-[160px] rounded-xl border border-gray-200 bg-white shadow-lg",
            "divide-y divide-gray-100"
          )}
          onMouseLeave={closeMenu}
        >
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                onClick={() => {
                  item.onSelect?.();
                  closeMenu();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
