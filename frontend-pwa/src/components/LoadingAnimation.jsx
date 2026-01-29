import React from "react";

const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-3 h-3 bg-gray-700 rounded-full animate-ping delay-75"></div>
      <div className="w-3 h-3 bg-gray-700 rounded-full animate-ping delay-150"></div>
      <div className="w-3 h-3 bg-gray-700 rounded-full animate-ping delay-225"></div>
    </div>
  );
};

export default LoadingDots;
