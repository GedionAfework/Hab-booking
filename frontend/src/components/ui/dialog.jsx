import React from "react";
import ModalDialog from "../ModalDialog";

export const Dialog = ({ open, onOpenChange, title, children }) => (
  <ModalDialog open={open} onClose={() => onOpenChange?.(false)} title={title}>
    {children}
  </ModalDialog>
);

export const DialogTrigger = ({ asChild = false, children, onClick }) => {
  if (asChild) return React.cloneElement(children, { onClick });
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export const DialogContent = ({ children }) => <div>{children}</div>;
