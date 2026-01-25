import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-xl p-4 transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-[var(--button-primary)]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
