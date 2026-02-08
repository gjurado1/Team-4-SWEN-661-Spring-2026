// src/utils/theme.ts
export type ThemeMode = "system" | "light" | "dark";
export type VisionTheme = "normal" | "sepia" | "highContrast";

export type AppTheme = {
  isDark: boolean;
  colors: {
    // Core surfaces
    background: string; // bgPrimary
    surface: string; // bgSurface
    text: string; // textPrimary
    textMuted: string; // textSecondary
    border: string;

    // Buttons / focus
    primary: string; // buttonPrimary
    primaryHover: string; // buttonPrimaryHover
    focusRing: string;

    // Status
    success: string;
    warning: string;
    error: string;

    // Alerts
    alertErrorBg: string;
    alertErrorBorder: string;
    alertWarningBg: string;
    alertWarningBorder: string;
    alertInfoBg: string;
    alertInfoBorder: string;

    // Offline banner (if you use it later)
    offlineBg: string;
    offlineText: string;
  };
};

type FlutterAppColors = {
  bgPrimary: string;
  bgSurface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;

  buttonPrimary: string;
  buttonPrimaryHover: string;
  focusRing: string;

  statusSuccess: string;
  statusWarning: string;
  statusError: string;

  alertErrorBg: string;
  alertErrorBorder: string;

  alertWarningBg: string;
  alertWarningBorder: string;

  alertInfoBg: string;
  alertInfoBorder: string;

  offlineBg: string;
  offlineText: string;
};

// ✅ Exact ports of your Flutter AppColors
const FLUTTER_LIGHT: FlutterAppColors = {
  bgPrimary: "#F5F7FA",
  bgSurface: "#FFFFFF",
  textPrimary: "#1A2332",
  textSecondary: "#4A5568",
  border: "#CBD5E0",
  buttonPrimary: "#4C6FBC",
  buttonPrimaryHover: "#3D5A9A",
  focusRing: "#4C6FBC",
  statusSuccess: "#2F855A",
  statusWarning: "#D69E2E",
  statusError: "#C53030",
  alertErrorBg: "#FED7D7",
  alertErrorBorder: "#FC8181",
  alertWarningBg: "#FEF5E7",
  alertWarningBorder: "#F6C343",
  alertInfoBg: "#E6F2FF",
  alertInfoBorder: "#90C9FF",
  offlineBg: "#2D3748",
  offlineText: "#FFFFFF",
};

const FLUTTER_DARK_CONTRAST: FlutterAppColors = {
  bgPrimary: "#000000",
  bgSurface: "#1A1A1A",
  textPrimary: "#FFFFFF",
  textSecondary: "#E0E0E0",
  border: "#4A4A4A",
  buttonPrimary: "#0066FF",
  buttonPrimaryHover: "#0052CC",
  focusRing: "#00AAFF",
  statusSuccess: "#00FF00",
  statusWarning: "#FFCC00",
  statusError: "#FF3333",
  alertErrorBg: "#4D1A1A",
  alertErrorBorder: "#FF3333",
  alertWarningBg: "#4D4D1A",
  alertWarningBorder: "#FFCC00",
  alertInfoBg: "#1A2D4D",
  alertInfoBorder: "#0066FF",
  offlineBg: "#2A2A2A",
  offlineText: "#FFFFFF",
};

const FLUTTER_SEPIA: FlutterAppColors = {
  bgPrimary: "#F4F1E8",
  bgSurface: "#FDF9F0",
  textPrimary: "#3D3226",
  textSecondary: "#5C5242",
  border: "#D4C9B5",
  buttonPrimary: "#8B6F47",
  buttonPrimaryHover: "#6F5938",
  focusRing: "#8B6F47",
  statusSuccess: "#5A7A4A",
  statusWarning: "#B8882E",
  statusError: "#A84432",
  alertErrorBg: "#F5E5E0",
  alertErrorBorder: "#D4A59A",
  alertWarningBg: "#F5F0E0",
  alertWarningBorder: "#D4BF9A",
  alertInfoBg: "#E8EFF4",
  alertInfoBorder: "#B5CCD9",
  offlineBg: "#5C5242",
  offlineText: "#FDF9F0",
};

function toAppTheme(p: FlutterAppColors, isDark: boolean): AppTheme {
  return {
    isDark,
    colors: {
      background: p.bgPrimary,
      surface: p.bgSurface,
      text: p.textPrimary,
      textMuted: p.textSecondary,
      border: p.border,

      primary: p.buttonPrimary,
      primaryHover: p.buttonPrimaryHover,
      focusRing: p.focusRing,

      success: p.statusSuccess,
      warning: p.statusWarning,
      error: p.statusError,

      alertErrorBg: p.alertErrorBg,
      alertErrorBorder: p.alertErrorBorder,
      alertWarningBg: p.alertWarningBg,
      alertWarningBorder: p.alertWarningBorder,
      alertInfoBg: p.alertInfoBg,
      alertInfoBorder: p.alertInfoBorder,

      offlineBg: p.offlineBg,
      offlineText: p.offlineText,
    },
  };
}

/**
 * Build theme using EXACT Flutter color profiles:
 * - visionTheme="normal"      => AppColors.light
 * - visionTheme="highContrast"=> AppColors.darkContrast
 * - visionTheme="sepia"       => AppColors.sepia
 *
 * themeMode is kept for future extension, but for parity we let visionTheme drive.
 */
export function buildTheme(themeMode: ThemeMode, visionTheme: VisionTheme): AppTheme {
  void themeMode; // not needed for exact parity right now

  if (visionTheme === "highContrast") return toAppTheme(FLUTTER_DARK_CONTRAST, true);
  if (visionTheme === "sepia") return toAppTheme(FLUTTER_SEPIA, false);
  return toAppTheme(FLUTTER_LIGHT, false);
}
