import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/accessibility/ThemeSelector';
import { TextSizeControl } from '../components/accessibility/TextSizeControl';
import { Modal } from '../components/ui/Modal';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Lock, 
  Eye, 
  Globe, 
  HelpCircle,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showRollbackModal, setShowRollbackModal] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      icon: <User size={24} />,
      items: [
        { label: 'Profile Information', action: () => navigate('/profile') },
        { label: 'Password & Security', icon: <Lock size={20} /> },
        { label: 'Notifications', icon: <Bell size={20} /> }
      ]
    },
    {
      title: 'Accessibility',
      icon: <Eye size={24} />,
      items: [
        { label: 'Vision & Display', highlight: true },
        { label: 'Navigation Settings' },
        { label: 'Text & Clarity' }
      ]
    },
    {
      title: 'Developer',
      icon: <Globe size={24} />,
      items: [
        { label: 'Component Library', action: () => navigate('/component-library') },
        { label: 'Accessibility Annotations', action: () => navigate('/accessibility-annotations') },
        { label: 'Responsive Showcase', action: () => navigate('/responsive-showcase') }
      ]
    },
    {
      title: 'General',
      icon: <Globe size={24} />,
      items: [
        { label: 'Language & Region' },
        { label: 'Privacy Policy' },
        { label: 'Help & Support', icon: <HelpCircle size={20} /> }
      ]
    }
  ];

  const handleRollback = () => {
    // Reset to default settings
    localStorage.removeItem('careconnect-theme');
    localStorage.removeItem('careconnect-textsize');
    window.location.reload();
  };

  return (
    <div 
      className="min-h-screen bg-[var(--bg-primary)] relative"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 96px)'
      }}
    >
      {/* Header */}
      <header className="bg-[var(--bg-surface)] border-b-2 border-[var(--border)] py-4 sticky top-0 z-40" style={{
        marginTop: 'calc(-1 * max(env(safe-area-inset-top, 0px), 24px))',
        paddingTop: 'calc(max(env(safe-area-inset-top, 0px), 24px) + 16px + 1rem)',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </button>
            <h1>Settings</h1>
          </div>
        </div>
      </header>

      <div className="space-y-6" style={{
        paddingTop: '20px',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))',
        paddingBottom: '20px'
      }}>
        {/* Accessibility Preferences - Featured */}
        <div>
          <h2 className="mb-4 flex items-center gap-2">
            <Eye size={28} className="text-[var(--button-primary)]" />
            Accessibility Preferences
          </h2>

          <Card className="p-6 mb-6">
            <ThemeSelector />
          </Card>

          <Card className="p-6 mb-6">
            <TextSizeControl />
          </Card>

          {/* Additional Accessibility Options */}
          <Card className="p-6">
            <h3 className="mb-4">Additional Options</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                <div>
                  <div className="font-medium">Reduce Motion</div>
                  <div className="text-sm text-[var(--text-secondary)]">Minimize animations</div>
                </div>
                <input type="checkbox" className="w-6 h-6" />
              </label>

              <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                <div>
                  <div className="font-medium">Enhanced Focus Indicators</div>
                  <div className="text-sm text-[var(--text-secondary)]">Stronger focus outlines</div>
                </div>
                <input type="checkbox" defaultChecked className="w-6 h-6" />
              </label>

              <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                <div>
                  <div className="font-medium">Large Touch Targets</div>
                  <div className="text-sm text-[var(--text-secondary)]">Bigger buttons and controls</div>
                </div>
                <input type="checkbox" defaultChecked className="w-6 h-6" />
              </label>

              <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                <div>
                  <div className="font-medium">Screen Reader Support</div>
                  <div className="text-sm text-[var(--text-secondary)]">Optimize for assistive tech</div>
                </div>
                <input type="checkbox" className="w-6 h-6" />
              </label>
            </div>
          </Card>
        </div>

        {/* Other Settings Sections */}
        {settingsSections.map((section, idx) => (
          <div key={idx}>
            <h2 className="mb-4 flex items-center gap-2">
              <span className="text-[var(--button-primary)]">{section.icon}</span>
              {section.title}
            </h2>

            <Card className="divide-y-2 divide-[var(--border)]">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-4 hover:bg-[var(--bg-primary)] transition-colors ${
                    item.highlight ? 'bg-[var(--alert-info-bg)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-[var(--text-secondary)]" />
                </button>
              ))}
            </Card>
          </div>
        ))}

        {/* App Info */}
        <Card className="p-6 text-center">
          <h3 className="mb-2">CareConnect</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-1">Version 1.0.0</p>
          <p className="text-xs text-[var(--text-secondary)]">
            © 2025 CareConnect. All rights reserved.
          </p>
        </Card>
      </div>

      {/* Rollback Confirmation Modal */}
      <Modal
        isOpen={showRollbackModal}
        onClose={() => setShowRollbackModal(false)}
        title="Reset All Settings?"
      >
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            This will reset all your preferences including theme, text size, and accessibility settings to their defaults.
          </p>
          <div className="p-4 bg-[var(--alert-warning-bg)] border-2 border-[var(--alert-warning-border)] rounded-lg">
            <p className="font-medium text-[var(--status-warning)]">⚠️ Safety Notice</p>
            <p className="text-sm mt-2 text-[var(--text-secondary)]">
              You can always change these settings again after resetting.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowRollbackModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRollback}
              icon={<RotateCcw size={20} />}
              className="flex-1"
            >
              Reset Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};