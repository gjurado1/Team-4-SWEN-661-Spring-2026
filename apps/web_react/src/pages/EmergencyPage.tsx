import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { HeaderVoiceButton } from '../components/navigation/HeaderVoiceButton';
import { ArrowLeft, Phone, MapPin, AlertTriangle, User } from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emergencyActivated, setEmergencyActivated] = useState(false);

  const emergencyContacts = [
    { name: 'Emergency Services (911)', number: '911', type: 'Emergency' },
    { name: 'Primary Caregiver - Jane Doe', number: '(555) 987-6543', type: 'Caregiver' },
    { name: 'Dr. Sarah Miller', number: '(555) 234-5678', type: 'Doctor' },
    { name: 'Family Member - Robert Doe', number: '(555) 456-7890', type: 'Family' }
  ];

  const handleSOSPress = () => {
    setShowConfirmModal(true);
  };

  const confirmSOS = () => {
    setEmergencyActivated(true);
    setShowConfirmModal(false);
    // In a real app, this would trigger emergency protocols
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
        className="bg-[var(--status-error)] text-white border-b-2 border-[var(--status-error)] py-4 sticky top-0 z-40"
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
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="flex items-center gap-2">
              <AlertTriangle size={28} />
              <h1 className="text-white">Emergency</h1>
            </div>
          </div>

          {/* Voice button (NEW) */}
          <HeaderVoiceButton variant="inverted"/>
        </div>
      </header>

      <div
        className="space-y-6"
        style={{
          paddingTop: '20px',
          paddingLeft: 'calc(20px + env(safe-area-inset-left))',
          paddingRight: 'calc(20px + env(safe-area-inset-right))',
          paddingBottom: '20px'
        }}
      >
        {/* Emergency Activated Banner */}
        {emergencyActivated && (
          <Card className="p-6 bg-[var(--alert-error-bg)] border-[var(--alert-error-border)] border-4 animate-pulse">
            <div className="text-center">
              <AlertTriangle size={48} className="mx-auto mb-3 text-[var(--status-error)]" />
              <h2 className="text-[var(--status-error)] mb-2">Emergency Activated</h2>
              <p className="text-[var(--status-error)] font-medium">
                Your emergency contacts have been notified. Help is on the way.
              </p>
            </div>
          </Card>
        )}

        {/* SOS Button */}
        <Card className="p-8 text-center">
          <h2 className="mb-4">Need Immediate Help?</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Press the SOS button to alert your emergency contacts and caregivers
          </p>

          <button
            onClick={handleSOSPress}
            disabled={emergencyActivated}
            className="w-64 h-64 mx-auto bg-[var(--status-error)] hover:bg-[#a02020] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold text-3xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 border-8 border-white"
            aria-label="Emergency SOS"
          >
            <div className="flex flex-col items-center gap-3">
              <AlertTriangle size={64} />
              <span>SOS</span>
              <span className="text-lg font-normal">Press for Emergency</span>
            </div>
          </button>
        </Card>

        {/* Location Status */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MapPin size={24} className="text-[var(--button-primary)] flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Location Services</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                📍 Your location will be shared with emergency contacts when SOS is activated
              </p>
              <p className="text-sm text-[var(--status-success)] mt-2 font-medium">
                ✓ Location: 123 Main Street, Springfield, IL 62701
              </p>
            </div>
          </div>
        </Card>

        {/* Emergency Contacts */}
        <div>
          <h2 className="mb-4">Emergency Contacts</h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-[var(--button-primary)] rounded-full flex items-center justify-center text-white">
                      {contact.type === 'Emergency' ? (
                        <AlertTriangle size={24} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{contact.type}</p>
                      <p className="text-sm text-[var(--button-primary)] font-medium mt-1">
                        {contact.number}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="p-3 bg-[var(--status-success)] text-white rounded-lg hover:bg-[var(--status-success)]/80 transition-colors"
                    aria-label={`Call ${contact.name}`}
                  >
                    <Phone size={24} />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Safety Information */}
        <Card className="p-6 bg-[var(--alert-info-bg)] border-[var(--alert-info-border)]">
          <h3 className="font-semibold mb-3">Safety Information</h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li>• Pressing SOS will immediately notify all emergency contacts</li>
            <li>• Your location will be shared automatically</li>
            <li>• Emergency services can be contacted directly from this screen</li>
            <li>• Your caregiver will receive a priority alert</li>
          </ul>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Activate Emergency SOS?"
      >
        <div className="space-y-4">
          <div className="p-4 bg-[var(--alert-error-bg)] border-2 border-[var(--alert-error-border)] rounded-lg text-center">
            <AlertTriangle size={48} className="mx-auto mb-3 text-[var(--status-error)]" />
            <p className="font-medium text-[var(--status-error)]">
              This will immediately alert all your emergency contacts and caregivers.
            </p>
          </div>

          <p className="text-[var(--text-secondary)]">
            The following actions will be taken:
          </p>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li>✓ Notify all emergency contacts via SMS and phone call</li>
            <li>✓ Share your current location</li>
            <li>✓ Alert your primary caregiver</li>
            <li>✓ Log emergency event in your health records</li>
          </ul>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmSOS}
              className="flex-1"
            >
              Confirm Emergency
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
