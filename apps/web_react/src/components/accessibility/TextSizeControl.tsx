import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const TextSizeControl: React.FC = () => {
  const { textSize, setTextSize } = useTheme();

  const increaseSize = () => {
    if (textSize < 200) setTextSize(textSize + 10);
  };

  const decreaseSize = () => {
    if (textSize > 80) setTextSize(textSize - 10);
  };

  const resetSize = () => {
    setTextSize(100);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[var(--text-primary)]">Text Size</h3>
      <div className="flex items-center gap-4 flex-wrap">
        <Button
          variant="secondary"
          onClick={decreaseSize}
          disabled={textSize <= 80}
          icon={<ZoomOut size={20} />}
          aria-label="Decrease text size"
        >
          Smaller
        </Button>
        <div className="flex-1 min-w-[120px] text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{textSize}%</div>
          <div className="text-sm text-[var(--text-secondary)]">Current Size</div>
        </div>
        <Button
          variant="secondary"
          onClick={increaseSize}
          disabled={textSize >= 200}
          icon={<ZoomIn size={20} />}
          aria-label="Increase text size"
        >
          Larger
        </Button>
        {textSize !== 100 && (
          <Button
            variant="secondary"
            onClick={resetSize}
            icon={<RotateCcw size={20} />}
            aria-label="Reset text size"
          >
            Reset
          </Button>
        )}
      </div>
      <div className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg">
        <p className="text-[var(--text-primary)]">
          Sample text at current size: The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </div>
  );
};
