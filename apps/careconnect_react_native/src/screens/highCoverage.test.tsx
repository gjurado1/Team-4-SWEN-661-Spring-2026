/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-require-imports */

import React from "react";
import { render } from "@testing-library/react-native";

// ✅ Mock AppLayout so screens don’t require Navigation/useAuth inside layout
jest.mock("@/components/navigation/AppLayout", () => {
  const ReactActual = require("react");
  const RN = require("react-native");
  return {
    __esModule: true,
    AppLayout: ({ children }: { children: React.ReactNode }) =>
      ReactActual.createElement(RN.View, null, children),
  };
});

// ✅ Mock ThemeProvider hook used by screens
jest.mock("@/theme/ThemeProvider", () => {
  const ReactActual = require("react");
  const RN = require("react-native");
  return {
    __esModule: true,
    Text: (props: any) => ReactActual.createElement(RN.Text, props),
    useAppTheme: () => ({
      textScale: 1,
      theme: {
        colors: {
          primary: "#0A84FF",
          surface: "#FFFFFF",
          surfaceAlt: "#F2F2F7",
          text: "#111111",
          danger: "#FF3B30",
          success: "#34C759",
          warning: "#FF9F0A",
          border: "#D1D1D6",
          muted: "#8E8E93",
        },
      },
    }),
  };
});

// ✅ Mock Auth hook (your screens use useAuth())
jest.mock("@/context/AuthContext", () => ({
  __esModule: true,
  useAuth: () => ({
    role: "patient",
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// ✅ Mock SettingsContext (this DOES exist in your repo)
jest.mock("@/context/SettingsContext", () => ({
  __esModule: true,
  useSettings: () => ({
    themeMode: "system",
    setThemeMode: jest.fn(),
    textScale: 1,
    setTextScale: jest.fn(),
  }),
}));

// ✅ Mock navigation hooks
jest.mock("@react-navigation/native", () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

describe("high coverage screens", () => {
  it("renders EmergencyScreen without crashing", () => {
    const { EmergencyScreen } = require("./EmergencyScreen");
    expect(() => render(<EmergencyScreen />)).not.toThrow();
  });

  it("renders SettingsScreen without crashing", () => {
    const { SettingsScreen } = require("./SettingsScreen");
    expect(() => render(<SettingsScreen />)).not.toThrow();
  });
});
