import React from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Text, useAppTheme } from "../../theme/ThemeProvider";
import { useSettings } from "../../context/SettingsContext";

type SizePreset = { label: string; percent: string; value: number };

const PRESETS: SizePreset[] = [
  { label: "Normal", percent: "100%", value: 1.0 },
  { label: "Medium", percent: "150%", value: 1.5 },
  { label: "Large", percent: "200%", value: 2.0 },
];

function isClose(a: number, b: number) {
  return Math.abs(a - b) < 0.06;
}

export default function TextSizeControl() {
  const { theme, textScale } = useAppTheme();
  const { width } = useWindowDimensions();
  const { textScale: storedScale, setTextScale } = useSettings();

  const cols = width >= 900 ? 3 : width >= 600 ? 2 : 1;

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontWeight: "900", fontSize: 16 * textScale }}>Text Size</Text>

      <View style={[styles.grid, { gap: 12 }]}>
        {PRESETS.map((p) => {
          const active = isClose(storedScale, p.value);
          return (
            <Pressable
              key={p.label}
              onPress={() => setTextScale(p.value)}
              testID={`settings-textsize-${Math.round(p.value * 100)}`}
              style={[
                styles.tile,
                {
                  width: cols === 1 ? "100%" : cols === 2 ? "48.5%" : "32%",
                  backgroundColor: active ? theme.colors.primary : theme.colors.background,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${p.label} text size ${p.percent}`}
              accessibilityState={{ selected: active }}
            >
              <Text style={{ fontWeight: "900", fontSize: 22 * textScale, color: active ? theme.colors.surface : theme.colors.text }}>
                Aa
              </Text>
              <Text style={{ fontWeight: "900", color: active ? theme.colors.surface : theme.colors.text, marginTop: 6 }}>
                {p.label}
              </Text>
              <Text style={{ color: active ? theme.colors.surface : theme.colors.textMuted, marginTop: 2 }}>
                {p.percent}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ color: theme.colors.textMuted, marginTop: 6 }}>
        Sample text at current size: The quick brown fox jumps over the lazy dog.
      </Text>
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
    minHeight: 96,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
});
