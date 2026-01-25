import React from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { BottomNav } from '../components/navigation/BottomNav';
import { ArrowLeft, BarChart3, TrendingUp, Calendar } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();

  const summaryStats = [
    { label: 'Check-Ins This Week', value: '6/7', icon: '✓', color: 'var(--status-success)' },
    { label: 'Avg. Mood', value: 'Good', icon: '🙂', color: 'var(--status-success)' },
    { label: 'Symptoms Logged', value: '3', icon: '📋', color: 'var(--button-primary)' },
    { label: 'Medications On Time', value: '92%', icon: '💊', color: 'var(--status-success)' }
  ];

  const recentReports = [
    { date: 'Week of Jan 15-21', summary: '6 check-ins completed, generally positive mood' },
    { date: 'Week of Jan 8-14', summary: '7 check-ins completed, mild headache reported twice' },
    { date: 'Week of Jan 1-7', summary: '5 check-ins completed, fatigue noted' }
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
      <header className="bg-[var(--bg-surface)] border-b-2 border-[var(--border)] py-4 sticky top-0 z-40" style={{
        marginTop: 'calc(-1 * max(env(safe-area-inset-top, 0px), 24px))',
        paddingTop: 'calc(max(env(safe-area-inset-top, 0px), 24px) + 16px + 1rem)',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))'
      }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1>Reports</h1>
        </div>
      </header>

      <div className="space-y-6" style={{
        paddingTop: '20px',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))',
        paddingBottom: '20px'
      }}>
        {/* Summary Stats */}
        <div>
          <h2 className="mb-4">This Week's Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            {summaryStats.map((stat, idx) => (
              <Card key={idx} className="p-4">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Trend Indicator */}
        <Card className="p-6 bg-[var(--alert-info-bg)] border-[var(--alert-info-border)]">
          <div className="flex items-center gap-3">
            <TrendingUp size={32} className="text-[var(--status-success)]" />
            <div>
              <h3 className="font-semibold text-[var(--status-success)]">Positive Trend</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Your check-in consistency has improved by 15% this month
              </p>
            </div>
          </div>
        </Card>

        {/* Recent Reports */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={24} className="text-[var(--button-primary)]" />
            <h2>Recent Reports</h2>
          </div>

          <div className="space-y-3">
            {recentReports.map((report, idx) => (
              <Card key={idx} className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">{report.date}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{report.summary}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav variant="patient" />
    </div>
  );
};