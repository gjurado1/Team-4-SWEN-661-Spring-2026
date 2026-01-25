import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  error
}) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block mb-2 font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 pr-10 border-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border)] focus:border-[var(--button-primary)] transition-colors min-h-[48px] appearance-none ${
            error ? 'border-[var(--status-error)]' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
        />
      </div>
      {error && (
        <p className="mt-2 text-[var(--status-error)] text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
