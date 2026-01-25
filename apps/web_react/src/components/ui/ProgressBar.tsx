import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">{progress}% Complete</span>
        </div>
      )}
      <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[var(--button-primary)] transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
