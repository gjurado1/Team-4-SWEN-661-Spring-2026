import React from 'react';
import { Home, Heart, ClipboardList, Pill, BarChart3, MessageCircle, User, AlertTriangle, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export const BottomNav: React.FC<{ variant?: 'caregiver' | 'patient' }> = ({ variant = 'caregiver' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const caregiverItems: NavItem[] = [
    { icon: <Home size={24} />, label: 'Home', path: '/caregiver/dashboard' },
    { icon: <ClipboardList size={24} />, label: 'Patient List', path: '/caregiver/patients' },
    { icon: <BarChart3 size={24} />, label: 'Schedule', path: '/caregiver/schedule' },
    { icon: <MessageCircle size={24} />, label: 'Messages', path: '/messages' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
    { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
    { icon: <AlertTriangle size={24} />, label: 'Emergency', path: '/emergency' },
    { icon: <LogOut size={24} />, label: 'Logout', path: '/login' }
  ];

  const patientItems: NavItem[] = [
    { icon: <Home size={24} />, label: 'Home', path: '/patient/dashboard' },
    { icon: <Heart size={24} />, label: 'Check-In', path: '/patient/checkin' },
    { icon: <MessageCircle size={24} />, label: 'Messages', path: '/messages' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
    { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
    { icon: <AlertTriangle size={24} />, label: 'Emergency', path: '/emergency' },
    { icon: <LogOut size={24} />, label: 'Logout', path: '/login' }
  ];

  const items = variant === 'caregiver' ? caregiverItems : patientItems;

  return (
    <nav 
      className="bg-[var(--bg-surface)] border-t-2 border-[var(--border)] sticky bottom-0 z-40"
      style={{
        height: '96px',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div 
        className="flex items-center gap-2 overflow-x-auto overflow-y-hidden h-full"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: 'max(16px, env(safe-area-inset-left))',
          paddingRight: 'max(16px, env(safe-area-inset-right))'
        }}
      >
        <style>{`
          nav > div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all flex-shrink-0 ${
                isActive 
                  ? 'text-[var(--button-primary)] bg-[var(--bg-primary)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              style={{
                minWidth: '80px',
                minHeight: '64px'
              }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.cloneElement(item.icon as React.ReactElement, { size: 32 })}
              </div>
              <span className="text-xs font-medium text-center whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
        {/* Trailing spacer to ensure last item is fully visible when scrolled */}
        <div className="flex-shrink-0" style={{ width: '16px' }} aria-hidden="true" />
      </div>
    </nav>
  );
};