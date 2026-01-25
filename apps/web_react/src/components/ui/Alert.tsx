import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'warning' | 'info';
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type, children, onClose, className = '' }) => {
  const icons = {
    error: <AlertTriangle size={24} />,
    warning: <AlertTriangle size={24} />,
    info: <Info size={24} />
  };

  const styles = {
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  return (
    <div className={`alert ${styles[type]} flex items-start gap-3 ${className}`} role="alert">
      <span className="flex-shrink-0 mt-0.5">{icons[type]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button 
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss alert"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
