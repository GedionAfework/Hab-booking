import React from "react";
import { cn } from "./utils";

export const SidebarLayout = ({ sidebar, children, className }) => (
  <div className={cn("grid gap-6 md:grid-cols-[240px,1fr]", className)}>
    <aside className="rounded-2xl border border-gray-200 bg-white p-4">{sidebar}</aside>
    <main>{children}</main>
  </div>
);
