import React from "react";

// Simple Button component
export const Button = ({ children, onClick, variant, size, className }) => {
  let baseClasses =
    "px-3 py-1 rounded font-medium transition-colors duration-200";

  // Variants
  if (variant === "destructive") {
    baseClasses += " bg-red-500 text-white hover:bg-red-600";
  } else if (variant === "link") {
    baseClasses += " text-blue-500 underline hover:text-blue-600 bg-transparent";
  } else {
    baseClasses += " bg-gray-200 hover:bg-gray-300 text-black";
  }

  // Sizes
  if (size === "sm") baseClasses += " text-sm";
  if (size === "lg") baseClasses += " text-lg";

  return (
    <button onClick={onClick} className={`${baseClasses} ${className || ""}`}>
      {children}
    </button>
  );
};
