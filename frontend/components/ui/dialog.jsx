import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-96 relative">
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => <div>{children}</div>;
export const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const DialogTitle = ({ children }) => <h3 className="text-lg font-bold">{children}</h3>;
