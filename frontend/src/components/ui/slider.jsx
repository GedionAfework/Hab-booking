import React from "react";
import { cn } from "./utils";

export const Slider = ({ className, value = 0, min = 0, max = 100, step = 1, onChange }) => (
  <input
    type="range"
    className={cn("w-full", className)}
    value={value}
    min={min}
    max={max}
    step={step}
    onChange={(e) => onChange?.(Number(e.target.value))}
  />
);
