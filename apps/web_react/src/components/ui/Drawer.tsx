import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'left'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} h-full w-80 max-w-full bg-[var(--bg-surface)] border-${position === 'left' ? 'r' : 'l'}-2 border-[var(--border)] z-50 shadow-2xl transform transition-transform duration-300`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b-2 border-[var(--border)]">
            <h2 className="font-semibold text-[var(--text-primary)]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close drawer"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
          {children}
        </div>
      </div>
    </>
  );
};
