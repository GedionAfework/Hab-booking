import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "./utils";

const TabsContext = createContext(null);

const Tabs = ({ value, defaultValue, onValueChange, children, className }) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const currentValue = isControlled ? value : internalValue;

  const context = useMemo(
    () => ({
      value: currentValue,
      setValue: (next) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
    }),
    [currentValue, isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={context}>
      <div className={cn("space-y-3", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, children }) => (
  <div className={cn("inline-flex rounded-full bg-gray-100 p-1 text-sm font-semibold dark:bg-gray-800", className)}>
    {children}
  </div>
);

const TabsTrigger = ({ value, className, children }) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");
  const active = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={cn(
        "flex items-center justify-center rounded-full px-4 py-2 transition",
        active ? "bg-white text-gray-900 shadow dark:bg-slate-900 dark:text-white" : "text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className, children }) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
