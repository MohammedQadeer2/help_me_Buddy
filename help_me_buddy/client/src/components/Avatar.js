import React from 'react';

export default function Avatar({ src, alt, size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <img 
      src={src || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
      alt={alt || "Avatar"} 
      className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover border-2 border-gray-800 ${className}`}
    />
  );
}