import React from "react";
import { cn } from "./utils";

const Avatar = ({ src, alt, name, className }) => {
  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <span className={cn("relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-gray-200", className)}>
      {src ? (
        <img src={src} alt={alt || name || "avatar"} className="h-full w-full object-cover" />
      ) : (
        <span className="text-sm font-semibold">{initials}</span>
      )}
    </span>
  );
};

export { Avatar };
