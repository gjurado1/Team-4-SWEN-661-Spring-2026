import React from "react";
import { render, type RenderOptions } from "@testing-library/react-native";

import { SettingsProvider } from "../context/SettingsContext";
import { ThemeProvider } from "../theme/ThemeProvider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SettingsProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: Providers, ...options });
}
