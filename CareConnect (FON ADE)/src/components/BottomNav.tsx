import { Home, List, Settings } from 'lucide-react';

type Screen = 'home' | 'list' | 'settings';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as Screen, label: 'Home', icon: Home },
    { id: 'list' as Screen, label: 'List', icon: List },
    { id: 'settings' as Screen, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-[#1C2128] border-t-2 border-[#3A3F45]" role="navigation" aria-label="Main navigation">
      <div className="flex justify-around items-center px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[80px] min-h-[48px] py-2 px-4 rounded-lg transition-colors ${
                isActive ? 'text-[#2EC4B6]' : 'text-[#D1D5DB]'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={28} strokeWidth={2.5} />
              <span className="text-sm font-bold mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}