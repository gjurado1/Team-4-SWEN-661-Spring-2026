import React from 'react';

interface RadioProps {
  label?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  name: string;
}

export const Radio: React.FC<RadioProps> = ({ label, checked, onChange, disabled = false, name }) => {
  return (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 border-2 rounded-full transition-all ${
            checked
              ? 'border-[var(--button-primary)]'
              : 'border-[var(--border)]'
          }`}
        >
          {checked && (
            <div className="w-3 h-3 bg-[var(--button-primary)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      {label && <span className="font-medium text-[var(--text-primary)]">{label}</span>}
    </label>
  );
};
