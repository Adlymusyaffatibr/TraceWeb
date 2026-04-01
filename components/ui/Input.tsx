"use client";

import React, { useState } from "react";

// Extend dari bawaan HTML input, ditambah props custom lu (misal label & error)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, type = "text", className = "", ...props }: InputProps) => {
  // State khusus buat toggle password
  const [showPassword, setShowPassword] = useState(false);

  // Cek apakah ini input password
  const isPassword = type === "password";
  // Kalau password dan lagi di-show, ubah jadi text. Sisanya ikutin type dari props.
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Render label kalau ada */}
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="relative">
        <input
          type={inputType}
          className={`w-full border rounded-md px-3 py-2 text-sm outline-none transition-colors duration-200 
            ${error ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-blue-500"} 
            ${className}`}
          {...props} // Ini bakal masukin value, onChange, placeholder, dll otomatis
        />

        {/* Tombol mata khusus buat type="password" */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {/* Render error message kalau ada */}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;