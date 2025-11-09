import React from "react";
import { cn } from "./utils";

export const Table = ({ className, children }) => (
  <table className={cn("w-full text-sm text-gray-700", className)}>{children}</table>
);

export const TableHeader = ({ className, children }) => (
  <thead className={cn("bg-gray-50 text-left text-xs font-semibold uppercase", className)}>
    {children}
  </thead>
);

export const TableBody = ({ className, children }) => (
  <tbody className={cn("divide-y divide-gray-100", className)}>{children}</tbody>
);

export const TableRow = ({ className, children }) => (
  <tr className={cn("hover:bg-gray-50", className)}>{children}</tr>
);

export const TableCell = ({ className, children }) => (
  <td className={cn("px-4 py-3", className)}>{children}</td>
);

export const TableHead = ({ className, children }) => (
  <th className={cn("px-4 py-3 text-gray-500", className)}>{children}</th>
);
