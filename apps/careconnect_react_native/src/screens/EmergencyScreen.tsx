// src/screens/EmergencyScreen.tsx
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppLayout } from "../components/navigation/AppLayout";
import { ScreenContainer } from "../components/ScreenContainer";
import { AppCard } from "../components/ui/AppCard";
import { AppButton } from "../components/ui/AppButton";
import { Text, useAppTheme } from "../theme/ThemeProvider";
import type { RootStackParamList } from "../navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type EmergencyContact = {
  name: string;
  number: string;
  type: "Emergency" | "Caregiver" | "Doctor" | "Family";
};

const CONTACTS: EmergencyContact[] = [
  { name: "Emergency Services (911)", number: "911", type: "Emergency" },
  { name: "Primary Caregiver - Jane Doe", number: "(555) 987-6543", type: "Caregiver" },
  { name: "Dr. Sarah Miller", number: "(555) 234-5678", type: "Doctor" },
  { name: "Family Member - Robert Doe", number: "(555) 456-7890", type: "Family" },
];

function withAlpha(hex: string, alpha: number) {
  // "#RRGGBB" -> "#RRGGBBAA"
  const a = Math.max(0, Math.min(1, alpha));
  const aa = Math.round(a * 255).toString(16).padStart(2, "0").toUpperCase();
  return `${hex}${aa}`;
}

function Header({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}) {
  const { theme, textScale } = useAppTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.error,
          borderBottomColor: theme.colors.error,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.headerBack}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 18 * textScale }}>
            ←
          </Text>
        </Pressable>

        <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 18 * textScale }}>
          ⚠
        </Text>

        <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 18 * textScale }}>
          {title}
        </Text>

        <View style={{ flex: 1 }} />

        {right ?? null}
      </View>
    </View>
  );
}

function ContactIcon({ type }: { type: EmergencyContact["type"] }) {
  return (
    <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
      {type === "Emergency" ? "⚠" : "👤"}
    </Text>
  );
}

function ConfirmEmergencyDialog({
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
          onPress={() => {}}
          style={[
            styles.dialog,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
          accessibilityRole="alert"
          accessibilityLabel="Activate Emergency SOS confirmation"
        >
          <View style={styles.dialogHeader}>
            <Text style={{ fontWeight: "900", fontSize: 18 * textScale }}>
              Activate Emergency SOS?
            </Text>

            <Pressable onPress={onCancel} accessibilityRole="button" accessibilityLabel="Close dialog">
              <Text style={{ fontWeight: "900", fontSize: 18 * textScale }}>✕</Text>
            </Pressable>
          </View>

          <View style={{ height: 12 }} />

          <ScrollView style={{ maxHeight: 340 }} contentContainerStyle={{ gap: 12 }}>
            <View
              style={[
                styles.dialogWarning,
                {
                  backgroundColor: withAlpha(theme.colors.error, 0.1),
                  borderColor: withAlpha(theme.colors.error, 0.7),
                },
              ]}
            >
              <Text style={{ fontSize: 18 * textScale, color: theme.colors.error, fontWeight: "900" }}>
                ⚠
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800", color: theme.colors.error }}>
                  This will immediately alert all your emergency contacts and caregivers.
                </Text>
              </View>
            </View>

            <Text style={{ color: theme.colors.textMuted }}>
              The following actions will be taken:
            </Text>

            <Text style={{ color: theme.colors.textMuted, lineHeight: 22 * textScale }}>
              {"✓ Notify all emergency contacts via SMS and phone call\n" +
                "✓ Share your current location\n" +
                "✓ Alert your primary caregiver\n" +
                "✓ Log emergency event in your health records"}
            </Text>
          </ScrollView>

          <View style={{ height: 14 }} />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <AppButton title="Cancel" variant="secondary" onPress={onCancel} expand />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton title="Confirm Emergency" variant="danger" onPress={onConfirm} expand />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function EmergencyScreen() {
  const navigation = useNavigation<Nav>();
  const { theme, textScale } = useAppTheme();

  const [emergencyActivated, setEmergencyActivated] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleBack = React.useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  }, [navigation]);

  const handleSOS = React.useCallback(() => {
    if (emergencyActivated) return;
    setConfirmOpen(true);
  }, [emergencyActivated]);

  const confirmSOS = React.useCallback(() => {
    setConfirmOpen(false);
    setEmergencyActivated(true);
  }, []);

  const callContact = React.useCallback((c: EmergencyContact) => {
    // Demo only. Later: Linking.openURL(`tel:${...}`)
    void c;
  }, []);

  return (
    <AppLayout>
      <Header
        title="Emergency"
        onBack={handleBack}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voice"
            style={[styles.micButton, { borderColor: withAlpha("#FFFFFF", 0.6) }]}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>🎤</Text>
          </Pressable>
        }
      />

      <ScreenContainer scroll testID="emergency-screen">
        <View style={{ gap: 16 }}>
          {emergencyActivated ? (
            <AppCard>
              <View style={{ padding: 16 }}>
                <View
                  style={[
                    styles.activatedBox,
                    {
                      backgroundColor: withAlpha(theme.colors.error, 0.12),
                      borderColor: withAlpha(theme.colors.error, 0.45),
                    },
                  ]}
                >
                  <Text style={{ fontSize: 28 * textScale, color: theme.colors.error, fontWeight: "900" }}>
                    ⚠
                  </Text>
                  <Text
                    style={{
                      fontWeight: "900",
                      color: theme.colors.error,
                      fontSize: 20 * textScale,
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    Emergency Activated
                  </Text>
                  <Text style={{ fontWeight: "700", color: theme.colors.error, textAlign: "center", marginTop: 6 }}>
                    Your emergency contacts have been notified. Help is on the way.
                  </Text>
                </View>
              </View>
            </AppCard>
          ) : null}

          <AppCard>
            <View style={{ padding: 18, alignItems: "center", gap: 10 }}>
              <Text style={{ fontWeight: "900", fontSize: 20 * textScale, textAlign: "center" }}>
                Need Immediate Help?
              </Text>

              <Text style={{ color: theme.colors.textMuted, textAlign: "center" }}>
                Press the SOS button to alert your emergency contacts and caregivers
              </Text>

              <View style={{ height: 8 }} />

              <Pressable
                onPress={handleSOS}
                disabled={emergencyActivated}
                accessibilityRole="button"
                accessibilityLabel="SOS"
                accessibilityHint="Press to activate emergency SOS"
                accessibilityState={{ disabled: emergencyActivated }}
                style={({ pressed }) => [
                  styles.sosOuter,
                  {
                    opacity: emergencyActivated ? 0.65 : pressed ? 0.92 : 1,
                    backgroundColor: theme.colors.error,
                  },
                ]}
              >
                <View style={styles.sosInner}>
                  <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 44 * textScale }}>⚠</Text>
                  <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 32 * textScale }}>SOS</Text>
                  <Text style={{ color: withAlpha("#FFFFFF", 0.92), fontWeight: "600" }}>
                    Press for Emergency
                  </Text>
                </View>
              </Pressable>
            </View>
          </AppCard>

          <AppCard>
            <View style={{ padding: 14 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Text style={{ fontSize: 18 * textScale, color: theme.colors.primary, fontWeight: "900" }}>📍</Text>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={{ fontWeight: "800", fontSize: 16 * textScale }}>Location Services</Text>
                  <Text style={{ color: theme.colors.textMuted }}>
                    📍 Your location will be shared with emergency contacts when SOS is activated
                  </Text>
                  <Text style={{ color: theme.colors.success, fontWeight: "800" }}>
                    ✓ Location: 123 Main Street, Springfield, IL 62701
                  </Text>
                </View>
              </View>
            </View>
          </AppCard>

          <Text style={{ fontWeight: "900", fontSize: 20 * textScale }}>Emergency Contacts</Text>

          <View style={{ gap: 12 }}>
            {CONTACTS.map((c) => (
              <AppCard key={c.name}>
                <View style={{ padding: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                      <ContactIcon type={c.type} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "900" }}>{c.name}</Text>
                      <Text style={{ color: theme.colors.textMuted, marginTop: 2 }}>{c.type}</Text>
                      <Text style={{ color: theme.colors.primary, fontWeight: "800", marginTop: 6 }}>
                        {c.number}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => callContact(c)}
                      accessibilityRole="button"
                      accessibilityLabel={`Call ${c.name}`}
                      style={[styles.callButton, { backgroundColor: theme.colors.success }]}
                    >
                      <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 18 * textScale }}>📞</Text>
                    </Pressable>
                  </View>
                </View>
              </AppCard>
            ))}
          </View>

          <AppCard>
            <View style={{ padding: 16 }}>
              <View
                style={[
                  styles.safetyBox,
                  {
                    backgroundColor: withAlpha(theme.colors.primary, 0.1),
                    borderColor: withAlpha(theme.colors.primary, 0.3),
                  },
                ]}
              >
                <Text style={{ fontWeight: "900", fontSize: 16 * textScale }}>Safety Information</Text>

                <View style={{ height: 10 }} />

                <Text style={{ color: theme.colors.textMuted }}>
                  • Pressing SOS will immediately notify all emergency contacts
                </Text>
                <View style={{ height: 6 }} />
                <Text style={{ color: theme.colors.textMuted }}>• Your location will be shared automatically</Text>
                <View style={{ height: 6 }} />
                <Text style={{ color: theme.colors.textMuted }}>
                  • Emergency services can be contacted directly from this screen
                </Text>
                <View style={{ height: 6 }} />
                <Text style={{ color: theme.colors.textMuted }}>
                  • Your caregiver will receive a priority alert
                </Text>
              </View>
            </View>
          </AppCard>
        </View>

        <ConfirmEmergencyDialog
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmSOS}
        />
      </ScreenContainer>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.select({ ios: 46, android: 18, default: 18 }),
    paddingBottom: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerBack: {
    width: 40,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  micButton: {
    width: 40,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  activatedBox: {
    borderWidth: 4,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },

  sosOuter: {
    width: 260,
    height: 260,
    borderRadius: 260,
    borderWidth: 8,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  sosInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  safetyBox: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 16,
    justifyContent: "center",
  },
  dialog: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
  },
  dialogHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dialogWarning: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
});
