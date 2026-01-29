import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/accessibility/ThemeSelector';
import { TextSizeControl } from '../components/accessibility/TextSizeControl';
import { Modal } from '../components/ui/Modal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { HeaderVoiceButton } from '../components/navigation/HeaderVoiceButton';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Lock, 
  Eye, 
  Globe, 
  HelpCircle,
  ChevronRight,
  RotateCcw,
  Type,
  Settings,
  FileText,
  Mic
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showRollbackModal, setShowRollbackModal] = useState(false);

  // Developer section and related items removed
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
      <header
        className="bg-[var(--bg-surface)] border-b-2 border-[var(--border)] py-4 sticky top-0 z-40"
        style={{
          marginTop: 'calc(-1 * max(env(safe-area-inset-top, 0px), 24px))',
          paddingTop: 'calc(max(env(safe-area-inset-top, 0px), 24px) + 16px + 1rem)',
          paddingLeft: 'calc(20px + env(safe-area-inset-left))',
          paddingRight: 'calc(20px + env(safe-area-inset-right))'
        }}
      >
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

          {/* ✅ Voice button + actions */}
          <HeaderVoiceButton />
        </div>
      </header>

      <div className="space-y-8" style={{
        paddingTop: '20px',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))',
        paddingBottom: '20px'
      }}>
        {/* Accessibility Preferences */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Eye size={28} className="text-[var(--button-primary)]" />
            Accessibility Preferences
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {/* Vision Theme */}
            <AccordionItem value="vision-theme" className="border-2 border-[var(--border)] rounded-xl bg-[var(--bg-surface)] px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--bg-primary)] rounded-lg">
                    <Eye size={24} className="text-[var(--text-primary)]" />
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold block text-[var(--text-primary)]">Vision Theme</span>
                    <span className="text-sm text-[var(--text-secondary)] font-normal">Contrast and color settings</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <ThemeSelector />
              </AccordionContent>
            </AccordionItem>

            {/* Text Size */}
            <AccordionItem value="text-size" className="border-2 border-[var(--border)] rounded-xl bg-[var(--bg-surface)] px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--bg-primary)] rounded-lg">
                    <Type size={24} className="text-[var(--text-primary)]" />
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold block text-[var(--text-primary)]">Text Size</span>
                    <span className="text-sm text-[var(--text-secondary)] font-normal">Adjust font size</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <TextSizeControl />
              </AccordionContent>
            </AccordionItem>

            {/* Voice Features */}
            <AccordionItem value="voice-features" className="border-2 border-[var(--border)] rounded-xl bg-[var(--bg-surface)] px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--bg-primary)] rounded-lg">
                    <Mic size={24} className="text-[var(--text-primary)]" />
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold block text-[var(--text-primary)]">Voice Features</span>
                    <span className="text-sm text-[var(--text-secondary)] font-normal">Read aloud and voice commands</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                    <div>
                      <div className="font-medium">Read Aloud</div>
                      <div className="text-sm text-[var(--text-secondary)]">Have the app read screens aloud</div>
                    </div>
                    <input type="checkbox" className="w-6 h-6 accent-[var(--button-primary)]" />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                    <div>
                      <div className="font-medium">Voice Commands</div>
                      <div className="text-sm text-[var(--text-secondary)]">Navigate and act using your voice</div>
                    </div>
                    <input type="checkbox" className="w-6 h-6 accent-[var(--button-primary)]" />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                    <div>
                      <div className="font-medium">Voice Reminders</div>
                      <div className="text-sm text-[var(--text-secondary)]">Play spoken reminders and alerts</div>
                    </div>
                    <input type="checkbox" className="w-6 h-6 accent-[var(--button-primary)]" />
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Interface Options */}
            <AccordionItem value="interface-options" className="border-2 border-[var(--border)] rounded-xl bg-[var(--bg-surface)] px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--bg-primary)] rounded-lg">
                    <Settings size={24} className="text-[var(--text-primary)]" />
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold block text-[var(--text-primary)]">Interface Options</span>
                    <span className="text-sm text-[var(--text-secondary)] font-normal">Motion, touch, and focus</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                    <div>
                      <div className="font-medium">Reduce Motion</div>
                      <div className="text-sm text-[var(--text-secondary)]">Minimize animations</div>
                    </div>
                    <input type="checkbox" className="w-6 h-6 accent-[var(--button-primary)]" />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                    <div>
                      <div className="font-medium">Enhanced Focus Indicators</div>
                      <div className="text-sm text-[var(--text-secondary)]">Stronger focus outlines</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-6 h-6 accent-[var(--button-primary)]" />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                    <div>
                      <div className="font-medium">Large Touch Targets</div>
                      <div className="text-sm text-[var(--text-secondary)]">Bigger buttons and controls</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-6 h-6 accent-[var(--button-primary)]" />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg cursor-pointer hover:bg-[var(--border)]/20 transition-colors">
                    <div>
                      <div className="font-medium">Screen Reader Support</div>
                      <div className="text-sm text-[var(--text-secondary)]">Optimize for assistive tech</div>
                    </div>
                    <input type="checkbox" className="w-6 h-6 accent-[var(--button-primary)]" />
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Other Sections */}
        {settingsSections.map((section, idx) => (
          <div key={idx}>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <span className="text-[var(--button-primary)]">{section.icon}</span>
              {section.title}
            </h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={section.title} className="border-2 border-[var(--border)] rounded-xl bg-[var(--bg-surface)] px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--bg-primary)] rounded-lg">
                      <FileText size={24} className="text-[var(--text-primary)]" />
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-bold block text-[var(--text-primary)]">{section.title} Settings</span>
                      <span className="text-sm text-[var(--text-secondary)] font-normal">Manage {section.title.toLowerCase()} preferences</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="divide-y-2 divide-[var(--border)]">
                    {section.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-primary)] transition-colors rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="font-medium text-[var(--text-primary)]">{item.label}</span>
                        </div>
                        <ChevronRight size={20} className="text-[var(--text-secondary)]" />
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}

        {/* App Info */}
        <Card className="p-6 text-center mt-8">
          <h3 className="mb-2 font-bold">CareConnect</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-1">Version 1.0.0</p>
          <p className="text-xs text-[var(--text-secondary)]">
            © 2025 CareConnect. All rights reserved.
          </p>
          <Button 
            variant="secondary" 
            onClick={() => setShowRollbackModal(true)}
            className="mt-4"
            icon={<RotateCcw size={16} />}
          >
            Reset All Settings
          </Button>
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
