import React, { createContext, useContext, useState } from "react";
import { cn } from "./utils";

const CollapsibleContext = createContext();

export const Collapsible = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children, className }) => {
  const [open, setOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const currentOpen = isControlled ? controlledOpen : open;

  const toggle = () => {
    const next = !currentOpen;
    if (!isControlled) setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ open: currentOpen, toggle }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </CollapsibleContext.Provider>
  );
};

export const CollapsibleTrigger = ({ className, children }) => {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error("CollapsibleTrigger must be used within Collapsible");
  return (
    <button type="button" onClick={ctx.toggle} className={cn("flex w-full items-center justify-between", className)}>
      {children}
      <span>{ctx.open ? "–" : "+"}</span>
    </button>
  );
};

export const CollapsibleContent = ({ className, children }) => {
  const ctx = useContext(CollapsibleContext);
  if (!ctx || !ctx.open) return null;
  return <div className={className}>{children}</div>;
};
