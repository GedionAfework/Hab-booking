import React from "react";
import { cn } from "./utils";
import { Button } from "./button";

export const Pagination = ({ page = 1, totalPages = 1, onChange, className }) => {
  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1).slice(0, 10);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => onChange?.(page - 1)}>
        Prev
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange?.(p)}
        >
          {p}
        </Button>
      ))}
      <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => onChange?.(page + 1)}>
        Next
      </Button>
    </div>
  );
};
