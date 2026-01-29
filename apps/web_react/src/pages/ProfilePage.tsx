import React from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { HeaderVoiceButton } from '../components/navigation/HeaderVoiceButton';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const profileData = {
    name: 'John Doe',
    role: 'Care Recipient',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: 'January 15, 1960',
    address: '123 Main Street, Springfield, IL 62701',
    emergencyContact: 'Jane Doe - (555) 987-6543'
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
            <h1>Profile</h1>
          </div>

          {/* ✅ Voice button + actions */}
          <HeaderVoiceButton />
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
        {/* Profile Header */}
        <Card className="p-6 text-center">
          <div className="w-24 h-24 bg-[var(--button-primary)] rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            {profileData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h2 className="mb-2">{profileData.name}</h2>
          <p className="text-[var(--text-secondary)]">{profileData.role}</p>
        </Card>

        {/* Personal Information */}
        <div>
          <h2 className="mb-4">Personal Information</h2>

          <Card className="divide-y-2 divide-[var(--border)]">
            <div className="p-4 flex items-center gap-4">
              <Mail size={24} className="text-[var(--button-primary)] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-secondary)]">Email</p>
                <p className="font-medium">{profileData.email}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-4">
              <Phone size={24} className="text-[var(--button-primary)] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-secondary)]">Phone</p>
                <p className="font-medium">{profileData.phone}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-4">
              <Calendar size={24} className="text-[var(--button-primary)] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-secondary)]">Date of Birth</p>
                <p className="font-medium">{profileData.dateOfBirth}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-4">
              <MapPin size={24} className="text-[var(--button-primary)] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-secondary)]">Address</p>
                <p className="font-medium">{profileData.address}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Emergency Contact */}
        <div>
          <h2 className="mb-4">Emergency Contact</h2>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <User size={24} className="text-[var(--status-error)] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-secondary)]">Primary Emergency Contact</p>
                <p className="font-medium">{profileData.emergencyContact}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
