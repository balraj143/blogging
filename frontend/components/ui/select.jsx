import React from "react";

export const Select = ({ value, onValueChange, children }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border rounded px-2 py-1"
    >
      {children}
    </select>
  );
};

export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

export const SelectTrigger = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;

export const SelectContent = ({ children }) => <>{children}</>;
