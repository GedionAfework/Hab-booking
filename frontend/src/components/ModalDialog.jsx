import React from 'react';
export default function ModalDialog({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="relative bg-slate-600 p-6 rounded-lg w-full max-w-md shadow-2xl border-2 border-gray-400 overflow-y-auto max-h-[90vh] animate-fadeIn">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-2xl absolute right-4 top-2 bg-gray-200 rounded-full px-2 hover:bg-gray-300">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
