import React from "react";
import { View, Text as RNText } from "react-native";
import { render } from "@testing-library/react-native";

import { ReportsScreen } from "./ReportsScreen";

/**
 * IMPORTANT:
 * We mock AppLayout + UI building blocks so this test focuses on ReportsScreen content,
 * and avoids needing AuthProvider / navigation setup.
 */

jest.mock("../components/navigation/AppLayout", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    AppLayout: ({ children }: { children: React.ReactNode }) => (
      <View testID="mock-app-layout">{children}</View>
    ),
  };
});

jest.mock("../components/ScreenContainer", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    ScreenContainer: ({
      children,
      testID,
    }: {
      children: React.ReactNode;
      testID?: string;
    }) => <View testID={testID ?? "mock-screen-container"}>{children}</View>,
  };
});

jest.mock("../components/ui/PageHeader", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    PageHeader: ({ title, subtitle }: { title: string; subtitle?: string }) => (
      <View>
        <Text>{title}</Text>
        {subtitle ? <Text>{subtitle}</Text> : null}
      </View>
    ),
    default: ({ title, subtitle }: { title: string; subtitle?: string }) => (
      <View>
        <Text>{title}</Text>
        {subtitle ? <Text>{subtitle}</Text> : null}
      </View>
    ),
  };
});

jest.mock("../components/ui/AppCard", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    AppCard: ({
      children,
      accessibilityLabel,
    }: {
      children: React.ReactNode;
      accessibilityLabel?: string;
    }) => (
      <View accessibilityLabel={accessibilityLabel}>{children}</View>
    ),
  };
});

jest.mock("../components/ui/AppBadge", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    AppBadge: ({ text }: { text: string; variant?: string }) => (
      <Text>{text}</Text>
    ),
  };
});

/**
 * ReportsScreen imports Text and useAppTheme from ThemeProvider.
 * We mock both so styling does not matter, but content is preserved.
 */
jest.mock("../theme/ThemeProvider", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    Text: ({ children }: { children: React.ReactNode; style?: any }) => (
      <Text>{children}</Text>
    ),
    useAppTheme: () => ({
      textScale: 1,
      theme: {
        colors: {
          primary: "#00f",
          textMuted: "#666",
        },
      },
    }),
  };
});

describe("ReportsScreen", () => {
  it("renders the Reports screen and key report/export content", () => {
    const { getByTestId, getByText, getByLabelText } = render(<ReportsScreen />);

    // Screen container exists
    expect(getByTestId("reports-screen")).toBeTruthy();

    // Header
    expect(getByText("Reports")).toBeTruthy();
    expect(getByText("Your health summaries")).toBeTruthy();

    // Section titles and key values
    expect(getByText("This week")).toBeTruthy();
    expect(getByText("Check-ins")).toBeTruthy();
    expect(getByText("6")).toBeTruthy();
    expect(getByText("Avg mood")).toBeTruthy();
    expect(getByText("🙂")).toBeTruthy();
    expect(getByText("Good")).toBeTruthy();

    // Informational copy
    expect(
      getByText(
        "Charts can be implemented using an Expo-friendly chart library if required."
      )
    ).toBeTruthy();

    // Export card
    expect(getByText("Export")).toBeTruthy();
    expect(
      getByText(
        "For demo purposes, exporting is not wired. Add CSV/PDF export based on your assignment needs."
      )
    ).toBeTruthy();

    // Accessibility labels on cards (from your component)
    expect(getByLabelText("Report summary")).toBeTruthy();
    expect(getByLabelText("Export")).toBeTruthy();
  });
});
