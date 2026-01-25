import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, disabled = false }) => {
  return (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 border-2 rounded transition-all ${
            checked
              ? 'bg-[var(--button-primary)] border-[var(--button-primary)]'
              : 'bg-[var(--bg-surface)] border-[var(--border)]'
          }`}
        >
          {checked && <Check size={20} className="text-white" />}
        </div>
      </div>
      {label && <span className="font-medium text-[var(--text-primary)]">{label}</span>}
    </label>
  );
};
