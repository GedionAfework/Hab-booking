import React from 'react';
import ModalDialog from './ModalDialog';
export default function ConfirmDialog({ open, text, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <ModalDialog open={open} title="Confirm Action" onClose={onCancel}>
      <p className="mb-4">{text}</p>
      <div className="flex justify-end gap-2">
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={onConfirm}>Yes, Delete</button>
      </div>
    </ModalDialog>
  );
}
