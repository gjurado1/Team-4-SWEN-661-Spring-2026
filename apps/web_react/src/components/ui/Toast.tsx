import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle size={24} />,
    error: <AlertTriangle size={24} />,
    info: <Info size={24} />
  };

  const styles = {
    success: 'bg-[var(--status-success)] text-white',
    error: 'bg-[var(--status-error)] text-white',
    info: 'bg-[var(--button-primary)] text-white'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className={`${styles[type]} px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}>
        {icons[type]}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
