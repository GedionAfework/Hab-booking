import React, { createContext, useContext, useState } from "react";
import { cn } from "./utils";

const AccordionContext = createContext();

export const Accordion = ({ type = "single", defaultValue, children, className }) => {
  const [value, setValue] = useState(defaultValue || (type === "single" ? null : []));

  const toggleItem = (itemValue) => {
    if (type === "single") {
      setValue((prev) => (prev === itemValue ? null : itemValue));
    } else {
      setValue((prev) => {
        const list = Array.isArray(prev) ? [...prev] : [];
        const index = list.indexOf(itemValue);
        if (index > -1) list.splice(index, 1);
        else list.push(itemValue);
        return list;
      });
    }
  };

  const ctx = {
    type,
    value,
    onToggle: toggleItem,
  };

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ value, children, className }) => (
  <div data-value={value} className={cn("overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800", className)}>
    {children}
  </div>
);

export const AccordionTrigger = ({ value, className, children }) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionTrigger must be used within Accordion");
  const isOpen = ctx.type === "single" ? ctx.value === value : ctx.value?.includes?.(value);
  return (
    <button
      type="button"
      onClick={() => ctx.onToggle(value)}
      className={cn(
        "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100",
        className
      )}
    >
      {children}
      <span className="text-lg">{isOpen ? "–" : "+"}</span>
    </button>
  );
};

export const AccordionContent = ({ value, className, children }) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionContent must be used within Accordion");
  const isOpen = ctx.type === "single" ? ctx.value === value : ctx.value?.includes?.(value);
  if (!isOpen) return null;
  return <div className={cn("px-4 pb-4 text-sm text-gray-600 dark:text-gray-400", className)}>{children}</div>;
};
