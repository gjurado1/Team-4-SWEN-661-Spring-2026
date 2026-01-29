import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { HeaderVoiceButton } from '../components/navigation/HeaderVoiceButton';
import { WifiOff, Heart, Clock, Activity } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { emoji: '😢', label: 'Very Sad', value: 'very-sad' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '🙂', label: 'Good', value: 'good' },
    { emoji: '😊', label: 'Great', value: 'great' }
  ];

  const recentCheckIns = [
    { date: 'Today, 9:00 AM', mood: 'Good', symptoms: 'Mild headache' },
    { date: 'Yesterday, 8:30 AM', mood: 'Great', symptoms: 'None reported' },
    { date: 'Jan 21, 8:00 AM', mood: 'Neutral', symptoms: 'Fatigue' }
  ];

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
            <div className="w-12 h-12 bg-[var(--button-primary)] rounded-full flex items-center justify-center text-white font-bold text-xl">
              SJ
            </div>
            <div>
              <h2 className="font-semibold">Hello, Sarah</h2>
              <p className="text-sm text-[var(--text-secondary)]">How are you feeling today?</p>
            </div>
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
        {/* Offline Alert */}
        <Alert type="info">
          <div className="flex items-start gap-2">
            <WifiOff size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong>Offline Mode</strong>
              <p className="text-sm mt-1">
                Last synced 2 hours ago. Your data will sync when reconnected.
              </p>
            </div>
          </div>
        </Alert>

        {/* Daily Check-In Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 text-[var(--button-primary)] mb-4">
            <Heart size={28} />
            <h2>Daily Check-In</h2>
          </div>
          <p className="text-[var(--text-secondary)] mb-4">Share how you're feeling today</p>

          {/* Mood Selector */}
          <div className="mb-6">
            <p className="font-medium mb-3 text-[var(--button-primary)]">How are you feeling today?</p>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    selectedMood === mood.value
                      ? 'border-[var(--button-primary)] bg-[var(--bg-primary)] ring-2 ring-[var(--button-primary)]/20'
                      : 'border-[var(--border)] hover:border-[var(--button-primary)]'
                  }`}
                  aria-label={mood.label}
                >
                  <div className="text-3xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/patient/checkin')}
            className="w-full"
          >
            Start Check-In
          </Button>
        </Card>

        {/* Recent Check-Ins */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={24} className="text-[var(--button-primary)]" />
            <h2>Recent Check-Ins</h2>
          </div>

          <div className="space-y-3">
            {recentCheckIns.map((checkIn, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--text-primary)]">{checkIn.date}</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      Mood: {checkIn.mood}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {checkIn.symptoms}
                    </p>
                  </div>
                  <Activity size={20} className="text-[var(--button-primary)]" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/patient/symptoms')}
            className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--button-primary)] transition-colors"
          >
            <Activity size={24} className="mx-auto mb-2 text-[var(--button-primary)]" />
            <div className="font-medium">Symptoms</div>
          </button>
          <button
            onClick={() => navigate('/patient/medications')}
            className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--button-primary)] transition-colors"
          >
            <Heart size={24} className="mx-auto mb-2 text-[var(--button-primary)]" />
            <div className="font-medium">Medications</div>
          </button>
        </div>
      </div>

      {/* BottomNav comes from AppLayout */}
    </div>
  );
};
