import React from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { BottomNav } from '../components/navigation/BottomNav';
import { ArrowLeft, Pill, Clock } from 'lucide-react';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export const MedicationsPage: React.FC = () => {
  const navigate = useNavigate();

  const medications: Medication[] = [
    { id: 1, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: true },
    { id: 2, name: 'Metformin', dosage: '500mg', time: '12:00 PM', taken: false },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', taken: false }
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
          <h1>Medications</h1>
        </div>
      </header>

      <div className="space-y-6" style={{
        paddingTop: '20px',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))',
        paddingBottom: '20px'
      }}>
        <h2 className="mb-4">Today's Schedule</h2>

        {medications.map((med) => (
          <Card key={med.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  med.taken ? 'bg-[var(--status-success)]/20' : 'bg-[var(--bg-primary)]'
                }`}>
                  💊
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{med.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{med.dosage}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={16} className="text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{med.time}</span>
                  </div>
                </div>
              </div>
              <div>
                {med.taken ? (
                  <div className="px-4 py-2 bg-[var(--status-success)] text-white rounded-lg font-medium">
                    ✓ Taken
                  </div>
                ) : (
                  <button className="px-4 py-2 bg-[var(--button-primary)] text-white rounded-lg font-medium hover:bg-[var(--button-primary-hover)] transition-colors">
                    Mark Taken
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav variant="patient" />
    </div>
  );
};