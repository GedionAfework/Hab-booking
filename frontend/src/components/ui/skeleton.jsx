import React from "react";
import { cn } from "./utils";

export const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse rounded-xl bg-gray-200", className)} />
);
