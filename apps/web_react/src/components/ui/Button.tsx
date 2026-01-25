import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  icon, 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 min-h-[48px] px-6';
  
  const variants = {
    primary: 'bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-transparent border-2 border-[var(--border)] hover:border-[var(--button-primary)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] disabled:opacity-50',
    destructive: 'bg-[var(--status-error)] hover:bg-[#a02020] text-white disabled:opacity-50'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
};
