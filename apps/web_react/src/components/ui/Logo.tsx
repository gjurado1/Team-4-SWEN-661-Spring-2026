import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showTagline = false 
}) => {
  const sizes = {
    sm: {
      container: 'gap-2',
      icon: 20,
      title: 'text-xl',
      tagline: 'text-xs'
    },
    md: {
      container: 'gap-3',
      icon: 32,
      title: 'text-3xl',
      tagline: 'text-sm'
    },
    lg: {
      container: 'gap-4',
      icon: 40,
      title: 'text-4xl',
      tagline: 'text-base'
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full ${className}`}>
      <div className={`flex items-center justify-center ${sizes[size].container}`}>
        <div className="bg-[var(--button-primary)] rounded-full p-2 flex items-center justify-center flex-shrink-0">
          <Heart size={sizes[size].icon} className="text-white fill-white" />
        </div>
        <h1 className={`${sizes[size].title} font-bold text-[var(--text-primary)] whitespace-nowrap`}>
          CareConnect
        </h1>
      </div>
      {showTagline && (
        <p className={`${sizes[size].tagline} text-[var(--text-secondary)] mt-2 text-center max-w-full px-4`}>
          Connect with care, track with confidence
        </p>
      )}
    </div>
  );
};