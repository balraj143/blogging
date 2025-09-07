import React from "react";

export const Table = ({ children, className }) => (
  <table className={`min-w-full border-collapse border border-gray-300 ${className || ""}`}>
    {children}
  </table>
);

export const TableHead = ({ children, className }) => (
  <thead className={`${className || ""} bg-gray-100`}>{children}</thead>
);

export const TableBody = ({ children, className }) => <tbody className={className || ""}>{children}</tbody>;

export const TableRow = ({ children, className }) => (
  <tr className={`border-b border-gray-300 ${className || ""}`}>{children}</tr>
);

export const TableCell = ({ children, className }) => (
  <td className={`px-4 py-2 ${className || ""}`}>{children}</td>
);
