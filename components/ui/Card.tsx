
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-[#10182c]/80 backdrop-blur-sm border border-blue-800/50 rounded-lg shadow-lg shadow-blue-500/10 p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
