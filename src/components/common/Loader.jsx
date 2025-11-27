import React from 'react';

const Loader = ({ size = "md", color = "text-gray-600", className = "" }) => {
  // Map sizes to pixel values for the container
  const sizeMap = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Generate 12 dots for a smooth circle
  const dots = Array.from({ length: 12 });

  return (
    <div className={`relative inline-block ${currentSize} ${color} ${className}`} role="status">
      {dots.map((_, i) => (
        <div
          key={i}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            transform: `rotate(${i * 30}deg)`,
          }}
        >
          <div
            className="block w-[20%] h-[20%] bg-current rounded-full mx-auto"
            style={{
              animation: "fade 1.2s linear infinite",
              animationDelay: `${-1.1 + (i * 0.1)}s`,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes fade {
          0%, 39%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default Loader;
