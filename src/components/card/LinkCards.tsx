import React from "react";

interface LinkCardsProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const LinkCards: React.FC<LinkCardsProps> = ({ title, subtitle, children }) => {
  return (
    <div className="max-w-md rounded-lg border border-gray-200 w-full bg-white shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-red-600 font-medium">{subtitle}</p>
      )}
      <div className="mt-4 text-gray-700">{children}</div>
    </div>
  );
};

export default LinkCards;
