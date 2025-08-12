// Loader.jsx
import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 transition-opacity duration-700 opacity-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
    </div>
  );
}
