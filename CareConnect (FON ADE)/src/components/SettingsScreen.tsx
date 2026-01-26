import { Header } from './Header';
import { SettingCard } from './SettingCard';

export function SettingsScreen() {
  const handleTextSizeChange = (size: string) => {
    console.log(`Text size changed to: ${size}`);
  };

  const handleContrastChange = (mode: string) => {
    console.log(`Contrast mode changed to: ${mode}`);
  };

  const handleVoiceToggle = (feature: string, enabled: boolean) => {
    console.log(`${feature} toggled to: ${enabled}`);
  };

  return (
    <div className="min-h-screen bg-[#0F1216] pb-6">
      <Header title="Accessibility Settings" />
      
      <main className="px-6 py-6 space-y-6">
        {/* Text Size Setting */}
        <SettingCard title="Text Size">
          <div className="space-y-3">
            <button
              onClick={() => handleTextSizeChange('large')}
              className="w-full min-h-[56px] bg-[#2EC4B6] text-[#0F1216] font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90"
              aria-label="Large text size - currently selected"
              aria-pressed="true"
            >
              LARGE (Current)
            </button>
            <button
              onClick={() => handleTextSizeChange('extra-large')}
              className="w-full min-h-[56px] bg-[#3A3F45] text-white font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90"
              aria-label="Extra large text size"
              aria-pressed="false"
            >
              EXTRA LARGE
            </button>
          </div>
        </SettingCard>

        {/* Contrast Mode Setting */}
        <SettingCard title="Contrast Mode">
          <div className="space-y-3">
            <button
              onClick={() => handleContrastChange('high')}
              className="w-full min-h-[56px] bg-[#2EC4B6] text-[#0F1216] font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90"
              aria-label="High contrast mode - currently selected"
              aria-pressed="true"
            >
              HIGH CONTRAST (Current)
            </button>
            <button
              onClick={() => handleContrastChange('ultra-high')}
              className="w-full min-h-[56px] bg-[#3A3F45] text-white font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90"
              aria-label="Ultra high contrast mode"
              aria-pressed="false"
            >
              ULTRA HIGH
            </button>
          </div>
        </SettingCard>

        {/* Voice Features Setting */}
        <SettingCard title="Voice Features">
          <div className="space-y-3">
            <button
              onClick={() => handleVoiceToggle('Voice Reminders', false)}
              className="w-full min-h-[56px] bg-[#22C55E] text-white font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90 flex items-center justify-between"
              aria-label="Voice reminders - currently on"
              aria-pressed="true"
            >
              <span>VOICE REMINDERS</span>
              <span>ON</span>
            </button>
            <button
              onClick={() => handleVoiceToggle('Read Aloud', false)}
              className="w-full min-h-[56px] bg-[#22C55E] text-white font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90 flex items-center justify-between"
              aria-label="Read aloud - currently on"
              aria-pressed="true"
            >
              <span>READ ALOUD</span>
              <span>ON</span>
            </button>
            <button
              onClick={() => handleVoiceToggle('Voice Commands', true)}
              className="w-full min-h-[56px] bg-[#3A3F45] text-white font-bold text-xl rounded-xl px-6 py-4 transition-opacity hover:opacity-90 flex items-center justify-between"
              aria-label="Voice commands - currently off"
              aria-pressed="false"
            >
              <span>VOICE COMMANDS</span>
              <span>OFF</span>
            </button>
          </div>
        </SettingCard>
      </main>
    </div>
  );
}