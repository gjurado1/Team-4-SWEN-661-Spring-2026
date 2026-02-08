// src/screens/zeroScreens.smoke.test.tsx
import React from "react";
import { render } from "@testing-library/react-native";
import { renderWithProviders } from "../test-utils/renderWithProviders";

/**
 * Navigation hooks (safe default).
 */
jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
  };
});

/**
 * ✅ FIX: Screens (or AppLayout) call useAuth(), but this smoke test does not
 * necessarily wrap AuthProvider. Mock it to return a stable value.
 *
 * We mock BOTH relative and alias paths because code may import either.
 */
jest.mock("../context/AuthContext", () => {
  return {
    __esModule: true,
    useAuth: () => ({
      role: "patient",
      username: "test-user",
      isHydrated: true,
      hydrate: jest.fn(async () => {}),
      login: jest.fn(async () => {}),
      logout: jest.fn(async () => {}),
    }),
    // If anything imports AuthProvider directly in these screens, provide a passthrough
    AuthProvider: ({ children }: any) => children,
  };
});

jest.mock("@/context/AuthContext", () => {
  return {
    __esModule: true,
    useAuth: () => ({
      role: "patient",
      username: "test-user",
      isHydrated: true,
      hydrate: jest.fn(async () => {}),
      login: jest.fn(async () => {}),
      logout: jest.fn(async () => {}),
    }),
    AuthProvider: ({ children }: any) => children,
  };
});

/**
 * IMPORTANT:
 * Do NOT mock "@/components/ui" unless you have src/components/ui/index.ts.
 * Instead mock the specific files screens import.
 *
 * Also: jest.mock factories are hoisted, so they MUST NOT reference out-of-scope vars.
 */

// PageHeader
jest.mock("../components/ui/PageHeader", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const PageHeader = (props: any) => (
    <View accessibilityLabel="PageHeader">
      <Text>PageHeader</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: PageHeader, PageHeader };
});

jest.mock("@/components/ui/PageHeader", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const PageHeader = (props: any) => (
    <View accessibilityLabel="PageHeader">
      <Text>PageHeader</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: PageHeader, PageHeader };
});

// AppCard
jest.mock("../components/ui/AppCard", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppCard = (props: any) => (
    <View accessibilityLabel="AppCard">
      <Text>AppCard</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppCard, AppCard };
});
jest.mock("@/components/ui/AppCard", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppCard = (props: any) => (
    <View accessibilityLabel="AppCard">
      <Text>AppCard</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppCard, AppCard };
});

// AppButton
jest.mock("../components/ui/AppButton", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppButton = (props: any) => (
    <View accessibilityLabel={props?.accessibilityLabel ?? "AppButton"} accessibilityRole="button">
      <Text>{props?.title ?? props?.children ?? "AppButton"}</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppButton, AppButton };
});
jest.mock("@/components/ui/AppButton", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppButton = (props: any) => (
    <View accessibilityLabel={props?.accessibilityLabel ?? "AppButton"} accessibilityRole="button">
      <Text>{props?.title ?? props?.children ?? "AppButton"}</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppButton, AppButton };
});

// AppInput
jest.mock("../components/ui/AppInput", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppInput = (props: any) => (
    <View accessibilityLabel="AppInput">
      <Text>AppInput</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppInput, AppInput };
});
jest.mock("@/components/ui/AppInput", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppInput = (props: any) => (
    <View accessibilityLabel="AppInput">
      <Text>AppInput</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppInput, AppInput };
});

// AppAlert
jest.mock("../components/ui/AppAlert", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppAlert = (props: any) => (
    <View accessibilityLabel="AppAlert" accessibilityRole="alert">
      <Text>AppAlert</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppAlert, AppAlert };
});
jest.mock("@/components/ui/AppAlert", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppAlert = (props: any) => (
    <View accessibilityLabel="AppAlert" accessibilityRole="alert">
      <Text>AppAlert</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppAlert, AppAlert };
});

// AppTextarea
jest.mock("../components/ui/AppTextarea", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppTextarea = (props: any) => (
    <View accessibilityLabel="AppTextarea">
      <Text>AppTextarea</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppTextarea, AppTextarea };
});
jest.mock("@/components/ui/AppTextarea", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppTextarea = (props: any) => (
    <View accessibilityLabel="AppTextarea">
      <Text>AppTextarea</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppTextarea, AppTextarea };
});

// SettingsPanel
jest.mock("../components/ui/SettingsPanel", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const SettingsPanel = (props: any) => (
    <View accessibilityLabel="SettingsPanel">
      <Text>SettingsPanel</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: SettingsPanel, SettingsPanel };
});
jest.mock("@/components/ui/SettingsPanel", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const SettingsPanel = (props: any) => (
    <View accessibilityLabel="SettingsPanel">
      <Text>SettingsPanel</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: SettingsPanel, SettingsPanel };
});

// AppLogo
jest.mock("../components/ui/AppLogo", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppLogo = (props: any) => (
    <View accessibilityLabel="AppLogo">
      <Text>AppLogo</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppLogo, AppLogo };
});
jest.mock("@/components/ui/AppLogo", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const AppLogo = (props: any) => (
    <View accessibilityLabel="AppLogo">
      <Text>AppLogo</Text>
      {props?.children}
    </View>
  );
  return { __esModule: true, default: AppLogo, AppLogo };
});

/**
 * Helper: screens sometimes export default, sometimes named.
 */
function pickComponent(mod: any, preferredName: string) {
  if (!mod) return null;

  if (mod[preferredName] && typeof mod[preferredName] === "function") return mod[preferredName];
  if (mod.default && typeof mod.default === "function") return mod.default;

  for (const k of Object.keys(mod)) {
    if (typeof mod[k] === "function") return mod[k];
  }
  return null;
}

describe("screens smoke for 0% screens", () => {
  it("renders MedicationsScreen", () => {
    const mod = require("./MedicationsScreen");
    const Comp = pickComponent(mod, "MedicationsScreen");
    expect(Comp).toBeTruthy();
    expect(() => renderWithProviders(<Comp />)).not.toThrow();
  });

  it("renders ProfileScreen", () => {
    const mod = require("./ProfileScreen");
    const Comp = pickComponent(mod, "ProfileScreen");
    expect(Comp).toBeTruthy();
    expect(() => renderWithProviders(<Comp />)).not.toThrow();
  });

  it("renders SymptomsScreen", () => {
    const mod = require("./SymptomsScreen");
    const Comp = pickComponent(mod, "SymptomsScreen");
    expect(Comp).toBeTruthy();
    expect(() => renderWithProviders(<Comp />)).not.toThrow();
  });
});
