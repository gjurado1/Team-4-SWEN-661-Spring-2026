import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

export const TextSizeControl: React.FC = () => {
  const { textSize, setTextSize } = useTheme();

  const handleSetSize = (size: number) => {
    setTextSize(size);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant={textSize === 100 ? 'primary' : 'secondary'}
          onClick={() => handleSetSize(100)}
          className="flex flex-col items-center justify-center h-24 py-2"
          aria-label="Set text size to Normal (100%)"
        >
          <span className="text-lg">Aa</span>
          <span className="text-sm font-normal mt-1">Normal</span>
          <span className="text-xs opacity-70">100%</span>
        </Button>

        <Button
          variant={textSize === 150 ? 'primary' : 'secondary'}
          onClick={() => handleSetSize(150)}
          className="flex flex-col items-center justify-center h-24 py-2"
          aria-label="Set text size to Medium (150%)"
        >
          <span className="text-xl">Aa</span>
          <span className="text-sm font-normal mt-1">Medium</span>
          <span className="text-xs opacity-70">150%</span>
        </Button>

        <Button
          variant={textSize === 200 ? 'primary' : 'secondary'}
          onClick={() => handleSetSize(200)}
          className="flex flex-col items-center justify-center h-24 py-2"
          aria-label="Set text size to Large (200%)"
        >
          <span className="text-2xl">Aa</span>
          <span className="text-sm font-normal mt-1">Large</span>
          <span className="text-xs opacity-70">200%</span>
        </Button>
      </div>
      
      <div className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg">
        <p className="text-[var(--text-primary)]">
          Sample text at current size: The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </div>
  );
};
