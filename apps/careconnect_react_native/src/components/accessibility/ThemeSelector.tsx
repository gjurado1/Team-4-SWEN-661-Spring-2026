import React from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Text, useAppTheme } from "../../theme/ThemeProvider";
import { useSettings, VisionTheme } from "../../context/SettingsContext";

type ThemeTile = {
  key: VisionTheme;
  title: string;
  subtitle: string;
  icon: string;
};

const TILES: ThemeTile[] = [
  { key: "normal", title: "Soft Blue-Gray", subtitle: "Default high contrast", icon: "☀️" },
  { key: "highContrast", title: "True Dark", subtitle: "Maximum contrast", icon: "🌙" },
  { key: "sepia", title: "Low-Glare Sepia", subtitle: "Reduced eye strain", icon: "👁️" },
];

export default function ThemeSelector() {
  const { theme, textScale } = useAppTheme();
  const { width } = useWindowDimensions();
  const { visionTheme, setVisionTheme } = useSettings();

  const cols = width >= 900 ? 3 : width >= 600 ? 2 : 1;

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontWeight: "900", fontSize: 16 * textScale }}>Vision Theme</Text>

      <View style={[styles.grid, { gap: 12 }]}>
        {TILES.map((t) => {
          const active = visionTheme === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setVisionTheme(t.key)}
              style={[
                styles.tile,
                {
                  width: cols === 1 ? "100%" : cols === 2 ? "48.5%" : "32%",
                  backgroundColor: theme.colors.background,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${t.title}. ${t.subtitle}`}
              accessibilityState={{ selected: active }}
            >
              <View
                style={[
                  styles.tileIcon,
                  {
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                <Text style={{ fontSize: 18 * textScale }}>{t.icon}</Text>
              </View>

              <Text style={{ fontWeight: "900", marginTop: 8 }}>{t.title}</Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 12 * textScale, marginTop: 2 }}>
                {t.subtitle}
              </Text>

              <View
                style={[
                  styles.activeBar,
                  {
                    backgroundColor: active ? theme.colors.primary : "transparent",
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                {active ? (
                  <Text style={{ fontWeight: "900", color: theme.colors.surface }}>Active</Text>
                ) : (
                  <Text style={{ fontWeight: "900", color: theme.colors.textMuted }}> </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tile: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    minHeight: 140,
    justifyContent: "space-between",
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderWidth: 3,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  activeBar: {
    marginTop: 12,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
});
