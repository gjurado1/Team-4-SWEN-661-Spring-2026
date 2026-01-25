import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { BottomNav } from '../components/navigation/BottomNav';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Activity, Plus } from 'lucide-react';

interface Symptom {
  id: number;
  name: string;
  icon: string;
  selected: boolean;
}

export const SymptomsPage: React.FC = () => {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState(3);
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { id: 1, name: 'Headache', icon: '🤕', selected: false },
    { id: 2, name: 'Fatigue', icon: '😴', selected: false },
    { id: 3, name: 'Nausea', icon: '🤢', selected: false },
    { id: 4, name: 'Fever', icon: '🤒', selected: false },
    { id: 5, name: 'Pain', icon: '💢', selected: false },
    { id: 6, name: 'Dizziness', icon: '😵', selected: false }
  ]);

  const toggleSymptom = (id: number) => {
    setSymptoms(symptoms.map(s => 
      s.id === id ? { ...s, selected: !s.selected } : s
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/patient/dashboard');
  };

  const severityLabels = ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'];

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
          <h1>Symptoms</h1>
        </div>
      </header>

      <div className="space-y-6" style={{
        paddingTop: '20px',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))',
        paddingBottom: '20px'
      }}>
        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Select your symptoms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {symptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    symptom.selected
                      ? 'border-[var(--button-primary)] bg-[var(--bg-primary)] ring-2 ring-[var(--button-primary)]/20'
                      : 'border-[var(--border)] hover:border-[var(--button-primary)]'
                  }`}
                >
                  <div className="text-3xl mb-2">{symptom.icon}</div>
                  <div className="text-sm font-medium">{symptom.name}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="mb-4">Severity Level</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="4"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-[var(--border)]"
                style={{
                  accentColor: 'var(--button-primary)'
                }}
              />
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                {severityLabels.map((label, idx) => (
                  <span 
                    key={idx}
                    className={idx === severity ? 'font-bold text-[var(--button-primary)]' : ''}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="text-center p-3 bg-[var(--bg-primary)] rounded-lg">
                <span className="text-xl font-bold text-[var(--button-primary)]">
                  {severityLabels[severity]}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="mb-4">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share any symptoms, medication effects, or general notes about your day"
              className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] focus:border-[var(--button-primary)] transition-colors min-h-[120px] resize-vertical"
            />
          </Card>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
          >
            Submit Log
          </Button>
        </form>
      </div>

      <BottomNav variant="patient" />
    </div>
  );
};