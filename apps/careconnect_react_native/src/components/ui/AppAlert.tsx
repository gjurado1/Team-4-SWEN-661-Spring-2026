import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useAppTheme } from "../../theme/ThemeProvider";

type Props = {
  variant?: "error" | "warning" | "info" | "success";
  message: string;
};

export function AppAlert({ variant = "info", message }: Props) {
  const { theme, textScale } = useAppTheme();

  const colors = (() => {
    switch (variant) {
      case "error":
        return { bg: theme.colors.alertErrorBg, border: theme.colors.alertErrorBorder, label: "ERROR" };
      case "warning":
        return { bg: theme.colors.alertWarningBg, border: theme.colors.alertWarningBorder, label: "WARNING" };
      case "success":
        return { bg: theme.colors.alertInfoBg, border: theme.colors.alertInfoBorder, label: "SUCCESS" };
      default:
        return { bg: theme.colors.alertInfoBg, border: theme.colors.alertInfoBorder, label: "INFO" };
    }
  })();

  return (
    <View
      testID={`app-alert-${variant}`}
      accessibilityRole="alert"
      accessibilityLabel={`${variant} alert`}
      style={[
        styles.root,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={{ fontWeight: "900", marginBottom: 6, fontSize: 14 * textScale }}>
        {colors.label}
      </Text>
      <Text style={{ fontSize: 14 * textScale }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
  },
});
