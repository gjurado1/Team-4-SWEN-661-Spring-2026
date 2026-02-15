import React from 'react';
import { View, Pressable } from 'react-native';
import { AppLayout } from '../components/navigation/AppLayout';
import { ScreenContainer } from '../components/ScreenContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { AppCard } from '../components/ui/AppCard';
import { AppTextarea } from '../components/ui/AppTextarea';
import { AppButton } from '../components/ui/AppButton';
import { Text, useAppTheme } from '../theme/ThemeProvider';

type Thread = { id: string; name: string; last: string; unread: boolean };

const SEED: Thread[] = [
  { id: '1', name: 'Sarah Johnson', last: 'Thanks, I feel better today.', unread: true },
  { id: '2', name: 'Robert Chen', last: 'I missed my morning dose.', unread: false },
  { id: '3', name: 'Care Team', last: 'Next steps for follow-up.', unread: false }
];

export function MessagesScreen() {
  const { theme, textScale } = useAppTheme();
  const [threads, setThreads] = React.useState<Thread[]>(SEED);
  const [selectedId, setSelectedId] = React.useState<string>('1');
  const [draft, setDraft] = React.useState('');

  const selected = threads.find((t) => t.id === selectedId) ?? threads[0];

  return (
    <AppLayout>
      <ScreenContainer scroll testID="messages-screen">
        <View style={{ gap: 16 }}>
          <PageHeader title="Messages" subtitle="Secure messaging" />

          <AppCard accessibilityLabel="Message threads">
            <Text style={{ fontWeight: '900', fontSize: 18 * textScale, marginBottom: 10 }}>Threads</Text>
            <View style={{ gap: 10 }}>
              {threads.map((t) => {
                const active = t.id === selectedId;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => {
                      setSelectedId(t.id);
                      setThreads((s) => s.map((x) => (x.id === t.id ? { ...x, unread: false } : x)));
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Open thread with ${t.name}`}
                    accessibilityState={{ selected: active }}
                    style={{
                      borderWidth: 2,
                      borderColor: active ? theme.colors.primary : theme.colors.border,
                      borderRadius: 14,
                      padding: 12,
                      backgroundColor: theme.colors.surfaceAlt
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={{ fontWeight: '900', flex: 1 }}>{t.name}</Text>
                      {t.unread ? <Text style={{ color: theme.colors.primary, fontWeight: '900' }}>NEW</Text> : null}
                    </View>
                    <Text style={{ color: theme.colors.textMuted, marginTop: 4 }}>{t.last}</Text>
                  </Pressable>
                );
              })}
            </View>
          </AppCard>

          <AppCard accessibilityLabel="Compose message">
            <Text style={{ fontWeight: '900', fontSize: 18 * textScale, marginBottom: 10 }}>
              To: {selected?.name}
            </Text>
            <AppTextarea
              label="Message"
              value={draft}
              onChangeText={setDraft}
              placeholder="Type your message..."
              testID="messages-compose-input"
            />
            <View style={{ marginTop: 10 }}>
              <AppButton
                title="Send"
                onPress={() => {
                  const msg = draft.trim();
                  if (!msg) return;
                  setThreads((s) => s.map((x) => (x.id === selectedId ? { ...x, last: msg } : x)));
                  setDraft('');
                }}
                expand
                accessibilityHint="Send message"
                testID="messages-send-button"
              />
            </View>
          </AppCard>
        </View>
      </ScreenContainer>
    </AppLayout>
  );
}
