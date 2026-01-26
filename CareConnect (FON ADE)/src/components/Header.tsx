import { Volume2 } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSpeaker?: boolean;
  onSpeakerClick?: () => void;
}

export function Header({ title, subtitle, showSpeaker = false, onSpeakerClick }: HeaderProps) {
  return (
    <header className="bg-[#2EC4B6] px-6 py-6 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-[#0F1216] font-bold text-3xl leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-[#0F1216] text-lg font-semibold mt-1">{subtitle}</p>
        )}
      </div>
      {showSpeaker && (
        <button
          onClick={onSpeakerClick}
          className="min-w-[48px] min-h-[48px] bg-[#0F1216] rounded-lg flex items-center justify-center ml-4"
          aria-label="Read aloud"
        >
          <Volume2 className="text-[#2EC4B6]" size={28} strokeWidth={2.5} />
        </button>
      )}
    </header>
  );
}