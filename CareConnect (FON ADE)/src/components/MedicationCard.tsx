import { Check } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  nextTime: string;
  instructions: string;
  taken: boolean;
}

interface MedicationCardProps {
  medication: Medication;
  onMarkAsTaken: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function MedicationCard({ medication, onMarkAsTaken, onViewDetails }: MedicationCardProps) {
  return (
    <article
      className="bg-[#1C2128] rounded-2xl p-6 border-2 border-[#3A3F45]"
      role="listitem"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-2xl mb-2">{medication.name}</h3>
          <p className="text-white text-xl mb-1" style={{ lineHeight: '1.5' }}>{medication.dosage}</p>
          <p className="text-[#D1D5DB] text-lg mb-1" style={{ lineHeight: '1.5' }}>Next: {medication.nextTime}</p>
          <p className="text-[#2EC4B6] text-lg" style={{ lineHeight: '1.5' }}>{medication.instructions}</p>
        </div>
        
        <div
          className={`min-w-[48px] min-h-[48px] rounded-lg flex items-center justify-center ml-4 ${
            medication.taken ? 'bg-[#22C55E]' : 'bg-[#3A3F45]'
          }`}
          role="img"
          aria-label={medication.taken ? 'Medication taken' : 'Not taken'}
        >
          {medication.taken && <Check className="text-white" size={32} strokeWidth={3} />}
        </div>
      </div>

      <div className="flex gap-3">
        {!medication.taken ? (
          <button
            onClick={() => onMarkAsTaken(medication.id)}
            className="flex-1 min-h-[56px] bg-[#22C55E] text-white font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90"
            aria-label={`Mark ${medication.name} as taken`}
          >
            MARK AS TAKEN
          </button>
        ) : (
          <button
            onClick={() => onViewDetails(medication.id)}
            className="flex-1 min-h-[56px] bg-[#4D96FF] text-white font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90"
            aria-label={`View details for ${medication.name}`}
          >
            VIEW DETAILS
          </button>
        )}
      </div>
    </article>
  );
}