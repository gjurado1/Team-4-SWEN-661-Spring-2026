import { Header } from './Header';
import { MedicationCard } from './MedicationCard';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  nextTime: string;
  instructions: string;
  taken: boolean;
}

export function MedicationListScreen() {
  const medications: Medication[] = [
    {
      id: '1',
      name: 'Aspirin',
      dosage: '75 mg',
      nextTime: '8:00 AM',
      instructions: 'Morning, with food',
      taken: false,
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500 mg',
      nextTime: '8:00 AM',
      instructions: 'Morning, with breakfast',
      taken: false,
    },
    {
      id: '3',
      name: 'Lisinopril',
      dosage: '10 mg',
      nextTime: '12:00 PM',
      instructions: 'Afternoon, before lunch',
      taken: true,
    },
  ];

  const handleSpeaker = () => {
    console.log('Read medications list aloud');
  };

  const handleMarkAsTaken = (medicationId: string) => {
    console.log(`Medication ${medicationId} marked as taken`);
  };

  const handleViewDetails = (medicationId: string) => {
    console.log(`View details for medication ${medicationId}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-6">
      <Header title="All Medications" showSpeaker={true} onSpeakerClick={handleSpeaker} />
      
      <main className="px-6 py-6">
        <div className="space-y-4" role="list" aria-label="Medication list">
          {medications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onMarkAsTaken={handleMarkAsTaken}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
