import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableListItemProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const ExpandableListItem: React.FC<ExpandableListItemProps> = ({
  title,
  children,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-2 border-[var(--border)] rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-primary)] transition-colors text-left"
        aria-expanded={isExpanded}
      >
        <span className="font-semibold text-[var(--text-primary)]">{title}</span>
        {isExpanded ? (
          <ChevronUp size={24} className="text-[var(--text-secondary)]" />
        ) : (
          <ChevronDown size={24} className="text-[var(--text-secondary)]" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 pt-0 border-t-2 border-[var(--border)] bg-[var(--bg-primary)]">
          {children}
        </div>
      )}
    </div>
  );
};
