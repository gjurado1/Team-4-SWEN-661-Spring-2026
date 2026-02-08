/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-require-imports */

import React from "react";
import { StyleSheet, Text as RNText } from "react-native";
import { render } from "@testing-library/react-native";

import { AppAlert } from "./AppAlert";
import { AppBadge } from "./AppBadge";
import { AppButton } from "./AppButton";
import { AppCard } from "./AppCard";
import { AppInput } from "./AppInput";
import { AppTextarea } from "./AppTextarea";
import { PageHeader } from "./PageHeader";

// ✅ Mock ThemeProvider used by these UI components (alias import: "@/theme/ThemeProvider")
jest.mock("@/theme/ThemeProvider", () => {
  const ReactActual = require("react");
  const RN = require("react-native");

  return {
    __esModule: true,
    // App components import { Text, useAppTheme } from ThemeProvider
    Text: (props: RN.TextProps) => ReactActual.createElement(RN.Text, props),
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
          muted: "#8E8E93"
        }
      }
    })
  };
});

describe("ui components", () => {
  it("AppButton calls onPress and supports disabled", () => {
    const onPress = jest.fn();
    const { getByA11yLabel } = render(
      <AppButton title="Go" onPress={onPress} accessibilityLabel="Go" />
    );

    // Press enabled
    getByA11yLabel("Go").props.onPress?.();
    expect(onPress).toHaveBeenCalledTimes(1);

    // Disabled should not call
    onPress.mockClear();
    const disabled = render(
      <AppButton title="Stop" onPress={onPress} disabled accessibilityLabel="Stop" />
    );
    disabled.getByA11yLabel("Stop").props.onPress?.();
    expect(onPress).toHaveBeenCalledTimes(0);
  });

  it("AppButton renders leftIcon when provided", () => {
    const LeftIcon = () => <RNText testID="left-icon">ICON</RNText>;
    const { getByTestId } = render(
      <AppButton title="Go" onPress={() => {}} leftIcon={LeftIcon} />
    );

    expect(getByTestId("left-icon")).toBeTruthy();
  });

  it("AppAlert renders message and role=alert", () => {
    const { getByA11yRole, getByText } = render(
      <AppAlert variant="error" message="Boom" />
    );

    expect(getByA11yRole("alert")).toBeTruthy();
    expect(getByText("Boom")).toBeTruthy();
  });

  it("AppBadge renders label", () => {
    const { getByText } = render(<AppBadge label="NEW" />);
    expect(getByText("NEW")).toBeTruthy();
  });

  it("AppInput renders and calls onChangeText", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <AppInput testID="my-input" value="" onChangeText={onChangeText} placeholder="x" />
    );

    getByTestId("my-input").props.onChangeText("hello");
    expect(onChangeText).toHaveBeenCalledWith("hello");
  });

  it("AppTextarea renders and calls onChangeText", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <AppTextarea testID="my-ta" value="" onChangeText={onChangeText} placeholder="y" />
    );

    getByTestId("my-ta").props.onChangeText("notes");
    expect(onChangeText).toHaveBeenCalledWith("notes");
  });

  it("PageHeader renders title and subtitle", () => {
    const { getByText } = render(
      <PageHeader title="Settings" subtitle="Configure app" />
    );

    expect(getByText("Settings")).toBeTruthy();
    expect(getByText("Configure app")).toBeTruthy();
  });

  it("AppCard renders a View with expected base styles (it does NOT render children in current implementation)", () => {
    const { getByTestId } = render(<AppCard testID="card" />);

    const card = getByTestId("card");
    const flat = StyleSheet.flatten(card.props.style);

    // From AppCard.tsx styles.base
    expect(flat.borderWidth).toBe(2);
    expect(flat.borderRadius).toBe(16);
    expect(flat.padding).toBe(16);
  });
});
