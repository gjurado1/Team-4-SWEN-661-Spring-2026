import React, { useMemo, useState } from 'react';
import {
  Home,
  Heart,
  ClipboardList,
  BarChart3,
  MessageCircle,
  User,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  ChevronDown
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  onClick?: () => void;
}

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // ✅ single source of truth for role
  const role = useMemo<'caregiver' | 'patient'>(() => {
    const stored = localStorage.getItem('careconnect-role');
    return stored === 'patient' ? 'patient' : 'caregiver';
  }, []);

  const caregiverItems: NavItem[] = [
    { icon: <Home size={32} />, label: 'Home', path: '/caregiver/dashboard' },
    { icon: <ClipboardList size={32} />, label: 'Patient List', path: '/caregiver/patients' },
    { icon: <BarChart3 size={32} />, label: 'Schedule', path: '/caregiver/schedule' },
    { icon: <MessageCircle size={32} />, label: 'Messages', path: '/messages' },
    { icon: <User size={32} />, label: 'Profile', path: '/profile' },
    { icon: <Settings size={32} />, label: 'Settings', path: '/settings' },
    { icon: <AlertTriangle size={32} />, label: 'Emergency', path: '/emergency' },
    {
      icon: <LogOut size={32} />,
      label: 'Logout',
      path: '/login',
      onClick: () => {
        localStorage.removeItem('careconnect-role'); // ✅ clear role on logout
      }
    }
  ];

  const patientItems: NavItem[] = [
    { icon: <Home size={32} />, label: 'Home', path: '/patient/dashboard' },
    { icon: <Heart size={32} />, label: 'Check-In', path: '/patient/checkin' },
    { icon: <MessageCircle size={32} />, label: 'Messages', path: '/messages' },
    { icon: <User size={32} />, label: 'Profile', path: '/profile' },
    { icon: <Settings size={32} />, label: 'Settings', path: '/settings' },
    { icon: <AlertTriangle size={32} />, label: 'Emergency', path: '/emergency' },
    {
      icon: <LogOut size={32} />,
      label: 'Logout',
      path: '/login',
      onClick: () => {
        localStorage.removeItem('careconnect-role'); // ✅ clear role on logout
      }
    }
  ];

  const items = role === 'caregiver' ? caregiverItems : patientItems;

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex flex-col"
            style={{
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            {/* Collapse Header */}
            <div className="p-4 border-b-2 border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
              <Button
                variant="secondary"
                onClick={() => setIsExpanded(false)}
                className="w-full h-16 text-xl font-bold border-2"
                icon={<ChevronDown size={28} />}
              >
                Collapse Menu
              </Button>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-primary)]">
              <div className="grid grid-cols-2 gap-4 pb-8">
                {items.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        item.onClick?.(); // ✅ run logout cleanup if defined
                        navigate(item.path);
                        setIsExpanded(false);
                      }}
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                        isActive
                          ? 'bg-[var(--button-primary)] text-white border-[var(--button-primary)]'
                          : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--button-primary)]'
                      }`}
                      style={{ minHeight: '140px' }}
                    >
                      <div
                        className={`p-3 rounded-full ${
                          isActive ? 'bg-white/20' : 'bg-[var(--bg-primary)]'
                        }`}
                      >
                        {React.cloneElement(item.icon as React.ReactElement, { size: 40 })}
                      </div>
                      <span className="text-lg font-bold text-center leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Menu Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)] border-t-2 border-[var(--border)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full h-16 flex items-center justify-center gap-3 text-[var(--text-primary)] active:bg-[var(--bg-primary)] transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={32} />
          <span className="text-xl font-bold">Menu</span>
        </button>
      </nav>
    </>
  );
};
