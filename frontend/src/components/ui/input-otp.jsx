import React, { useRef } from "react";
import { cn } from "./utils";

export const InputOTP = ({ length = 6, value = "", onChange, className }) => {
  const refs = useRef([]);

  const handleChange = (index, char) => {
    const sanitized = char.replace(/[^0-9a-z]/i, "").slice(-1);
    const arr = value.split("");
    arr[index] = sanitized;
    const nextValue = arr.join("");
    onChange?.(nextValue);
    if (sanitized && refs.current[index + 1]) refs.current[index + 1].focus();
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (refs.current[idx] = el)}
          value={value[idx] || ""}
          maxLength={1}
          onChange={(e) => handleChange(idx, e.target.value)}
          className="h-12 w-12 rounded-xl border border-gray-200 text-center text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      ))}
    </div>
  );
};
