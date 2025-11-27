import React from "react";

const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
  const colorConfig = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    green: {
      border: "border-green-500",
      bg: "bg-green-100",
      text: "text-green-600",
    },
    yellow: {
      border: "border-yellow-500",
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    indigo: {
      border: "border-indigo-500",
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <div
      className={`bg-white p-5 rounded-lg shadow-md border-l-4 ${config.border} hover:shadow-lg transition-shadow`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{value}</h2>
          {subtitle && <p className="text-xs mt-2">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-md ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
