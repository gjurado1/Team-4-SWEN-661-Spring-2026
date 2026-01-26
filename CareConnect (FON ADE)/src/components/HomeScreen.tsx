import { Header } from './Header';
import { Volume2 } from 'lucide-react';

export function HomeScreen() {
  const handleSpeaker = () => {
    console.log('Read aloud activated');
  };

  const handleMarkAsTaken = () => {
    console.log('Medication marked as taken');
  };

  const handleViewAll = () => {
    console.log('View all medications');
  };

  return (
    <div className="min-h-screen bg-[#0F1216]">
      <Header title="CareConnect" subtitle="Medication Tracker" />
      
      <main className="px-6 py-6 space-y-6">
        {/* Next Dose Alert Card */}
        <section 
          className="bg-[#EF4444] rounded-2xl p-6 border-2 border-[#3A3F45]"
          role="region"
          aria-label="Next medication dose alert"
        >
          <h2 className="text-white font-bold text-2xl mb-4">Next Dose</h2>
          <div className="space-y-2">
            <p className="text-white text-4xl font-bold">8:00 AM</p>
            <p className="text-white text-2xl font-semibold">Aspirin 75 mg</p>
          </div>
        </section>

        {/* Today's Medications Card */}
        <section 
          className="bg-[#1C2128] rounded-2xl p-6 border-2 border-[#3A3F45]"
          role="region"
          aria-label="Today's medications summary"
        >
          <h2 className="text-white font-bold text-2xl mb-4">Today's Medications</h2>
          <p className="text-[#D1D5DB] text-xl mb-6" style={{ lineHeight: '1.5' }}>3 medications scheduled</p>
          
          <div className="space-y-4">
            <button
              onClick={handleViewAll}
              className="w-full min-h-[56px] bg-[#2EC4B6] text-[#0F1216] font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90"
              aria-label="View all medications"
            >
              VIEW ALL
            </button>
            
            <button
              onClick={handleMarkAsTaken}
              className="w-full min-h-[56px] bg-[#22C55E] text-white font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90"
              aria-label="Mark medication as taken"
            >
              MARK AS TAKEN
            </button>
          </div>
        </section>

        {/* Voice Read-Aloud Card */}
        <section className="bg-[#1C2128] rounded-2xl p-6 border-2 border-[#3A3F45]">
          <button
            onClick={handleSpeaker}
            className="w-full min-h-[56px] bg-[#4D96FF] text-white font-bold text-xl rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-opacity hover:opacity-90"
            aria-label="Read screen aloud"
          >
            <Volume2 size={28} strokeWidth={2.5} />
            <span>READ ALOUD</span>
          </button>
        </section>
      </main>
    </div>
  );
}