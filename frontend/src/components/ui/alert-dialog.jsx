import React from "react";
import ModalDialog from "../ModalDialog";
import { Button } from "./button";

export const AlertDialog = ({ open, onClose, title = "Alert", description, confirmLabel = "Continue", cancelLabel = "Cancel", onConfirm }) => {
  if (!open) return null;
  return (
    <ModalDialog open={open} onClose={onClose} title={title}>
      {description && <p className="mb-6 text-sm text-gray-200">{description}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>{cancelLabel}</Button>
        <Button onClick={() => {
          onConfirm?.();
          onClose?.();
        }}>{confirmLabel}</Button>
      </div>
    </ModalDialog>
  );
};
