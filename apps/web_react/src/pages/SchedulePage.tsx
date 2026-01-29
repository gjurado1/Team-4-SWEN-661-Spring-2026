import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HeaderVoiceButton } from '../components/navigation/HeaderVoiceButton';
import { ArrowLeft, Calendar as CalendarIcon, Plus } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'today' | 'upcoming'>('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const appointments = {
    today: [],
    upcoming: []
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
              onClick={() => navigate('/caregiver/dashboard')}
              className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </button>
            <h1>Schedule</h1>
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
        {/* Today's Schedule Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon size={24} className="text-[var(--button-primary)]" />
            <h2>Today's Schedule</h2>
          </div>

          {/* Date Picker */}
          <div className="mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] focus:border-[var(--button-primary)] transition-colors"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedTab('today')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                selectedTab === 'today'
                  ? 'bg-[var(--button-primary)] text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-2 border-[var(--border)]'
              }`}
            >
              Today (0)
            </button>
            <button
              onClick={() => setSelectedTab('upcoming')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                selectedTab === 'upcoming'
                  ? 'bg-[var(--button-primary)] text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-2 border-[var(--border)]'
              }`}
            >
              Upcoming (0)
            </button>
          </div>

          {/* Empty State */}
          <Card className="p-12 text-center">
            <CalendarIcon size={64} className="mx-auto mb-4 text-[var(--text-secondary)]" />
            <h3 className="mb-2">No appointments today</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              You have a clear schedule for today
            </p>
            <Button
              variant="primary"
              onClick={() => {
                /* Add appointment logic */
              }}
              icon={<Plus size={20} />}
            >
              Schedule Appointment
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                /* View calendar */
              }}
              className="p-6 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--button-primary)] transition-colors"
            >
              <CalendarIcon size={32} className="mx-auto mb-2 text-[var(--button-primary)]" />
              <div className="font-medium">View Calendar</div>
            </button>
            <button
              onClick={() => {
                /* Add appointment */
              }}
              className="p-6 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--button-primary)] transition-colors"
            >
              <Plus size={32} className="mx-auto mb-2 text-[var(--button-primary)]" />
              <div className="font-medium">Add Appointment</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
