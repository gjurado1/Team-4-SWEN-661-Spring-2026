// src/screens/SettingsScreen.tsx
import React from "react";
import { View, Pressable, StyleSheet, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppLayout } from "../components/navigation/AppLayout";
import { ScreenContainer } from "../components/ScreenContainer";
import { AppCard } from "../components/ui/AppCard";
import { AppButton } from "../components/ui/AppButton";
import { PageHeader } from "../components/ui/PageHeader";
import { Text, useAppTheme } from "../theme/ThemeProvider";
import type { RootStackParamList } from "../navigation/types";

import ThemeSelector from "../components/accessibility/ThemeSelector";
import TextSizeControl from "../components/accessibility/TextSizeControl";
import { SettingsPanel } from "../components/ui/SettingsPanel";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type ToggleKey =
  | "careconnect-read-aloud"
  | "careconnect-voice-commands"
  | "careconnect-voice-reminders"
  | "careconnect-reduce-motion"
  | "careconnect-enhanced-focus"
  | "careconnect-large-touch"
  | "careconnect-screen-reader";

type ToggleState = {
  readAloud: boolean;
  voiceCommands: boolean;
  voiceReminders: boolean;

  reduceMotion: boolean;
  enhancedFocus: boolean;
  largeTouchTargets: boolean;
  screenReaderSupport: boolean;
};

const DEFAULTS: ToggleState = {
  readAloud: false,
  voiceCommands: false,
  voiceReminders: false,

  reduceMotion: false,
  enhancedFocus: true,
  largeTouchTargets: true,
  screenReaderSupport: false,
};

const STORAGE_KEYS: Record<keyof ToggleState, ToggleKey> = {
  readAloud: "careconnect-read-aloud",
  voiceCommands: "careconnect-voice-commands",
  voiceReminders: "careconnect-voice-reminders",

  reduceMotion: "careconnect-reduce-motion",
  enhancedFocus: "careconnect-enhanced-focus",
  largeTouchTargets: "careconnect-large-touch",
  screenReaderSupport: "careconnect-screen-reader",
};

async function getBool(key: string, fallback: boolean) {
  const v = await AsyncStorage.getItem(key);
  if (v === null) return fallback;
  return v === "true";
}

async function setBool(key: string, value: boolean) {
  await AsyncStorage.setItem(key, String(value));
}

async function removeKey(key: string) {
  await AsyncStorage.removeItem(key);
}

function ToggleRow({
  title,
  subtitle,
  value,
  onPress,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onPress: () => void;
}) {
  const { theme, textScale } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityState={{ checked: value }}
      style={[
        styles.toggleRow,
        { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "800", fontSize: 15 * textScale }}>{title}</Text>
        <Text style={{ color: theme.colors.textMuted, fontSize: 13 * textScale, marginTop: 4 }}>
          {subtitle}
        </Text>
      </View>

      <View
        style={[
          styles.pill,
          { backgroundColor: value ? theme.colors.primary : theme.colors.border },
        ]}
      >
        <Text style={{ fontWeight: "900", color: theme.colors.surface }}>{value ? "ON" : "OFF"}</Text>
      </View>
    </Pressable>
  );
}

function ResetDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { theme, textScale } = useAppTheme();

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={[styles.dialog, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={() => {}}
          accessibilityRole="alert"
          accessibilityLabel="Reset all settings confirmation"
        >
          <Text style={{ fontWeight: "900", fontSize: 18 * textScale, marginBottom: 10 }}>
            Reset All Settings?
          </Text>

          <Text style={{ color: theme.colors.textMuted, marginBottom: 12 }}>
            This will reset all your preferences including theme, text size, and accessibility settings to their defaults.
          </Text>

          <View style={[styles.warning, { borderColor: theme.colors.border }]}>
            <Text style={{ fontWeight: "900" }}>⚠️ Safety Notice</Text>
            <Text style={{ color: theme.colors.textMuted, marginTop: 6 }}>
              You can always change these settings again after resetting.
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
            <AppButton title="Cancel" variant="secondary" onPress={onCancel} />
            <AppButton title="Reset Settings" variant="danger" onPress={onConfirm} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { theme, textScale } = useAppTheme();

  const [toggles, setToggles] = React.useState<ToggleState>(DEFAULTS);
  const [resetOpen, setResetOpen] = React.useState(false);

  // Load persisted settings (Flutter initState/_loadSettings equivalent)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const next: ToggleState = {
        readAloud: await getBool(STORAGE_KEYS.readAloud, DEFAULTS.readAloud),
        voiceCommands: await getBool(STORAGE_KEYS.voiceCommands, DEFAULTS.voiceCommands),
        voiceReminders: await getBool(STORAGE_KEYS.voiceReminders, DEFAULTS.voiceReminders),

        reduceMotion: await getBool(STORAGE_KEYS.reduceMotion, DEFAULTS.reduceMotion),
        enhancedFocus: await getBool(STORAGE_KEYS.enhancedFocus, DEFAULTS.enhancedFocus),
        largeTouchTargets: await getBool(STORAGE_KEYS.largeTouchTargets, DEFAULTS.largeTouchTargets),
        screenReaderSupport: await getBool(STORAGE_KEYS.screenReaderSupport, DEFAULTS.screenReaderSupport),
      };
      if (mounted) setToggles(next);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setToggle = React.useCallback(async (key: keyof ToggleState, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
    await setBool(STORAGE_KEYS[key], value);
  }, []);

  const handleBack = React.useCallback(async () => {
    // 1) Normal case: go back if there is history
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    // 2) Fallback: determine where to go based on role (matches Flutter)
    const role = await AsyncStorage.getItem("careconnect-role");
    if (role === "caregiver") {
      navigation.reset({ index: 0, routes: [{ name: "CaregiverDashboard" }] });
    } else if (role === "patient") {
      navigation.reset({ index: 0, routes: [{ name: "PatientDashboard" }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  }, [navigation]);

  const handleResetAll = React.useCallback(async () => {
    // Match Flutter reset list (and existing keys)
    await removeKey("careconnect-theme");
    await removeKey("careconnect-textsize");
    await Promise.all(Object.values(STORAGE_KEYS).map((k) => removeKey(k)));

    setToggles(DEFAULTS);
    setResetOpen(false);
  }, []);

  const accountItems: Array<{ label: string; route: keyof RootStackParamList }> = [
    { label: "Profile Information", route: "Profile" },
    { label: "Password & Security", route: "Settings" },
    { label: "Notifications", route: "Settings" },
  ];

  const generalItems: Array<{ label: string; route: keyof RootStackParamList }> = [
    { label: "Language & Region", route: "Settings" },
    { label: "Privacy Policy", route: "Settings" },
    { label: "Help & Support", route: "Settings" },
  ];

  return (
    <AppLayout>
      <ScreenContainer scroll testID="settings-screen">
        <View style={{ gap: 16 }}>
          {/* Top row like the screenshot: back + title/subtitle */}
          <View style={styles.topRow}>
            <AppButton
              title="Back"
              variant="secondary"
              onPress={handleBack}
              accessibilityLabel="Back"
              testID="settings-back-button"
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "900", fontSize: 22 * textScale }}>Settings</Text>
              <Text style={{ color: theme.colors.textMuted }}>Theme, contrast, voice, and more</Text>
            </View>
          </View>

          <PageHeader title="Accessibility Preferences" subtitle="Vision, text size, and assistive options" />

          {/* These two should be expanded by default (like screenshot) */}
          <SettingsPanel
            title="Vision Theme"
            subtitle="Contrast and color settings"
            icon={<Text style={{ fontWeight: "900" }}>👁️</Text>}
            defaultOpen
          >
            <ThemeSelector />
          </SettingsPanel>

          <SettingsPanel
            title="Text Size"
            subtitle="Adjust font size"
            icon={<Text style={{ fontWeight: "900" }}>Tt</Text>}
            defaultOpen
          >
            <TextSizeControl />
          </SettingsPanel>

          {/* These are collapsed by default (like screenshot) */}
          <SettingsPanel
            title="Voice Features"
            subtitle="Read aloud and voice commands"
            icon={<Text style={{ fontWeight: "900" }}>🎤</Text>}
          >
            <View style={{ gap: 10 }}>
              <ToggleRow
                title="Read Aloud"
                subtitle="Have the app read screens aloud"
                value={toggles.readAloud}
                onPress={() => setToggle("readAloud", !toggles.readAloud)}
              />
              <ToggleRow
                title="Voice Commands"
                subtitle="Navigate and act using your voice"
                value={toggles.voiceCommands}
                onPress={() => setToggle("voiceCommands", !toggles.voiceCommands)}
              />
              <ToggleRow
                title="Voice Reminders"
                subtitle="Play spoken reminders and alerts"
                value={toggles.voiceReminders}
                onPress={() => setToggle("voiceReminders", !toggles.voiceReminders)}
              />
            </View>
          </SettingsPanel>

          <SettingsPanel
            title="Interface Options"
            subtitle="Motion, touch, and focus"
            icon={<Text style={{ fontWeight: "900" }}>⚙️</Text>}
          >
            <View style={{ gap: 10 }}>
              <ToggleRow
                title="Reduce Motion"
                subtitle="Minimize animations"
                value={toggles.reduceMotion}
                onPress={() => setToggle("reduceMotion", !toggles.reduceMotion)}
              />
              <ToggleRow
                title="Enhanced Focus Indicators"
                subtitle="Stronger focus outlines"
                value={toggles.enhancedFocus}
                onPress={() => setToggle("enhancedFocus", !toggles.enhancedFocus)}
              />
              <ToggleRow
                title="Large Touch Targets"
                subtitle="Bigger buttons and controls"
                value={toggles.largeTouchTargets}
                onPress={() => setToggle("largeTouchTargets", !toggles.largeTouchTargets)}
              />
              <ToggleRow
                title="Screen Reader Support"
                subtitle="Optimize for assistive tech"
                value={toggles.screenReaderSupport}
                onPress={() => setToggle("screenReaderSupport", !toggles.screenReaderSupport)}
              />
            </View>
          </SettingsPanel>

          {/* Account + General (kept simple, can be styled further if needed) */}
          <Text style={{ fontWeight: "900", fontSize: 18 * textScale, marginTop: 4 }}>Account</Text>
          <AppCard>
            <View style={{ gap: 8 }}>
              {accountItems.map((it) => (
                <Pressable
                  key={it.label}
                  onPress={() => navigation.navigate(it.route)}
                  style={[styles.navRow, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}
                  accessibilityRole="button"
                  accessibilityLabel={it.label}
                >
                  <Text style={{ fontWeight: "700" }}>{it.label}</Text>
                  <Text style={{ color: theme.colors.textMuted }}>›</Text>
                </Pressable>
              ))}
            </View>
          </AppCard>

          <Text style={{ fontWeight: "900", fontSize: 18 * textScale, marginTop: 4 }}>General</Text>
          <AppCard>
            <View style={{ gap: 8 }}>
              {generalItems.map((it) => (
                <Pressable
                  key={it.label}
                  onPress={() => navigation.navigate(it.route)}
                  style={[styles.navRow, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}
                  accessibilityRole="button"
                  accessibilityLabel={it.label}
                >
                  <Text style={{ fontWeight: "700" }}>{it.label}</Text>
                  <Text style={{ color: theme.colors.textMuted }}>›</Text>
                </Pressable>
              ))}
            </View>
          </AppCard>

          {/* App info + reset */}
          <AppCard accessibilityLabel="App info">
            <View style={{ alignItems: "center", gap: 6 }}>
              <Text style={{ fontWeight: "900", fontSize: 18 * textScale }}>CareConnect</Text>
              <Text style={{ color: theme.colors.textMuted }}>Version 1.0.0</Text>
              <Text style={{ color: theme.colors.textMuted, textAlign: "center" }}>
                © 2025 CareConnect. All rights reserved.
              </Text>
              <View style={{ marginTop: 10 }}>
                <AppButton
                  title="Reset All Settings"
                  variant="secondary"
                  onPress={() => setResetOpen(true)}
                  accessibilityLabel="Reset all settings"
                />
              </View>
            </View>
          </AppCard>
        </View>

        <ResetDialog open={resetOpen} onCancel={() => setResetOpen(false)} onConfirm={handleResetAll} />
      </ScreenContainer>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleRow: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pill: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 54,
    alignItems: "center",
  },
  navRow: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 16,
    justifyContent: "center",
  },
  dialog: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
  },
  warning: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
  },
});
