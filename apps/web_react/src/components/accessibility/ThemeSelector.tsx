import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Eye } from 'lucide-react';
import { Card } from '../ui/Card';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: 'default' as const,
      name: 'Soft Blue-Gray',
      description: 'Default high contrast',
      icon: <Sun size={32} />,
      preview: 'bg-[#f5f7fa] border-[#4c6fbc]'
    },
    {
      id: 'dark-contrast' as const,
      name: 'True Dark',
      description: 'Maximum contrast',
      icon: <Moon size={32} />,
      preview: 'bg-[#000000] border-[#0066ff]'
    },
    {
      id: 'sepia' as const,
      name: 'Low-Glare Sepia',
      description: 'Reduced eye strain',
      icon: <Eye size={32} />,
      preview: 'bg-[#f4f1e8] border-[#8b6f47]'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[var(--text-primary)]">Vision Theme</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((t) => (
          <Card
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`cursor-pointer transition-all ${
              theme === t.id 
                ? 'border-[var(--button-primary)] ring-4 ring-[var(--button-primary)]/20' 
                : 'hover:border-[var(--button-primary)]'
            }`}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-16 h-16 rounded-lg border-4 ${t.preview} flex items-center justify-center`}>
                {t.icon}
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{t.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{t.description}</p>
              </div>
              {theme === t.id && (
                <div className="w-full py-2 bg-[var(--button-primary)] text-white rounded font-medium text-sm">
                  Active
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
