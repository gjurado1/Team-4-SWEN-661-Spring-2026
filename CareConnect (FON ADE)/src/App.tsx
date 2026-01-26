import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { MedicationListScreen } from './components/MedicationListScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';

type Screen = 'home' | 'list' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  return (
    <div className="min-h-screen bg-[#0F1216] flex flex-col">
      <div className="flex-1 overflow-auto">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'list' && <MedicationListScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </div>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}