import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`rounded-2xl px-6 py-3 font-medium transition duration-300 shadow-md hover:scale-105 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
