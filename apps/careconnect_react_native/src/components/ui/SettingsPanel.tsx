import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, useAppTheme } from "../../theme/ThemeProvider";

export function SettingsPanel({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const { theme, textScale } = useAppTheme();
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      accessibilityRole="summary"
      accessibilityLabel={`${title} section`}
    >
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={styles.header}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint="Expands or collapses this section"
        accessibilityState={{ expanded: open }}
      >
        <View
          style={[
            styles.iconBox,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.background },
          ]}
        >
          {icon}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "900", fontSize: 18 * textScale }}>{title}</Text>
          <Text style={{ color: theme.colors.textMuted, fontSize: 13 * textScale, marginTop: 2 }}>
            {subtitle}
          </Text>
        </View>

        <Text style={{ fontWeight: "900", color: theme.colors.textMuted, fontSize: 18 * textScale }}>
          {open ? "⌃" : "⌄"}
        </Text>
      </Pressable>

      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 14,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
});
