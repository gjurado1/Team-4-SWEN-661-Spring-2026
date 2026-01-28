import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HeaderVoiceButton } from '../components/navigation/HeaderVoiceButton';
import { ArrowLeft } from 'lucide-react';

export const PatientCheckInPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');

  const moods = [
    { emoji: '😢', label: 'Very Sad', value: 'very-sad' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '🙂', label: 'Good', value: 'good' },
    { emoji: '😊', label: 'Great', value: 'great' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMood) {
      // Submit check-in (demo)
      navigate('/patient/dashboard');
    }
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
              onClick={() => navigate('/patient/dashboard')}
              className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </button>
            <h1>Daily Check-In</h1>
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
        <Card className="p-6">
          <p className="text-center text-[var(--text-secondary)] mb-6">
            Share how you're feeling today
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Selection */}
            <div>
              <h3 className="mb-4 text-[var(--button-primary)]">How are you feeling today?</h3>
              <div className="grid grid-cols-5 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedMood === mood.value
                        ? 'border-[var(--button-primary)] bg-[var(--bg-primary)] ring-4 ring-[var(--button-primary)]/20'
                        : 'border-[var(--border)] hover:border-[var(--button-primary)]'
                    }`}
                    aria-label={mood.label}
                  >
                    <div className="text-4xl mb-2">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms Input */}
            <div>
              <h3 className="mb-4 text-[var(--button-primary)]">Any symptoms or notes?</h3>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe any symptoms, feelings, or important notes..."
                className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] focus:border-[var(--button-primary)] transition-colors min-h-[120px] resize-vertical"
              />
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Share any symptoms, medication effects, or general notes about your day
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="primary" disabled={!selectedMood} className="w-full">
              Submit Check-In
            </Button>

            {!selectedMood && (
              <p className="text-center text-sm text-[var(--text-secondary)]">
                Please select your mood to submit your check-in
              </p>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
