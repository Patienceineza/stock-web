import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  color?: string; // Allows customization of text color
  icon?: React.ReactNode; // Optional icon to enhance visual appearance
}

const Card: React.FC<CardProps> = ({ title, value, color = "text-black", icon }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">{title}</h2>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <p className={`text-2xl font-semibold ${color} mt-2`}>{value}</p>
    </div>
  );
};

export default Card;
