import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "system" | "light" | "dark";
export type VisionTheme = "normal" | "sepia" | "highContrast";

type SettingsState = {
  themeMode: ThemeMode;
  visionTheme: VisionTheme;
  textScale: number;
  isHydrated: boolean;
};

type SettingsContextValue = SettingsState & {
  hydrate: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setVisionTheme: (v: VisionTheme) => Promise<void>;
  setTextScale: (n: number) => Promise<void>;
};

const STORAGE_THEME_MODE = "careconnect-themeMode";
const STORAGE_VISION = "careconnect-visionTheme";
const STORAGE_TEXT_SCALE = "careconnect-textScale";

const ThemeModes: readonly ThemeMode[] = ["system", "light", "dark"] as const;
const VisionThemes: readonly VisionTheme[] = ["normal", "sepia", "highContrast"] as const;

function isThemeMode(v: string | null): v is ThemeMode {
  return v !== null && (ThemeModes as readonly string[]).includes(v);
}

function isVisionTheme(v: string | null): v is VisionTheme {
  return v !== null && (VisionThemes as readonly string[]).includes(v);
}

function parseTextScale(v: string | null): number {
  if (!v) return 1;
  const n = Number(v);
  if (!Number.isFinite(n)) return 1;
  return Math.max(0.85, Math.min(2.0, n));
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SettingsState>({
    themeMode: "system",
    visionTheme: "normal",
    textScale: 1,
    isHydrated: false,
  });

  const hydrate = React.useCallback(async () => {
    const [themeModeRaw, visionThemeRaw, textScaleRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_THEME_MODE),
      AsyncStorage.getItem(STORAGE_VISION),
      AsyncStorage.getItem(STORAGE_TEXT_SCALE),
    ]);

    setState({
      themeMode: isThemeMode(themeModeRaw) ? themeModeRaw : "system",
      visionTheme: isVisionTheme(visionThemeRaw) ? visionThemeRaw : "normal",
      textScale: parseTextScale(textScaleRaw),
      isHydrated: true,
    });
  }, []);

  const setThemeMode = React.useCallback(async (mode: ThemeMode) => {
    await AsyncStorage.setItem(STORAGE_THEME_MODE, mode);
    setState((s) => ({ ...s, themeMode: mode }));
  }, []);

  const setVisionTheme = React.useCallback(async (v: VisionTheme) => {
    await AsyncStorage.setItem(STORAGE_VISION, v);
    setState((s) => ({ ...s, visionTheme: v }));
  }, []);

  const setTextScale = React.useCallback(async (n: number) => {
    const clamped = Math.max(0.85, Math.min(2.0, n));
    await AsyncStorage.setItem(STORAGE_TEXT_SCALE, String(clamped));
    setState((s) => ({ ...s, textScale: clamped }));
  }, []);

  const value: SettingsContextValue = {
    ...state,
    hydrate,
    setThemeMode,
    setVisionTheme,
    setTextScale,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
