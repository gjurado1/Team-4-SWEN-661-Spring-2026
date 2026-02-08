/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-require-imports */

import React from "react";
import { StyleSheet } from "react-native";
import { render } from "@testing-library/react-native";

import { AppAlert } from "./AppAlert";
import { AppBadge } from "./AppBadge";
import { AppButton } from "./AppButton";
import { AppCard } from "./AppCard";
import { AppInput } from "./AppInput";
import { AppTextarea } from "./AppTextarea";
import { PageHeader } from "./PageHeader";

// Mock ThemeProvider hook used by these UI components (alias import: "@/theme/ThemeProvider")
jest.mock("@/theme/ThemeProvider", () => {
  const ReactActual = require("react");
  const RN = require("react-native");

  return {
    __esModule: true,
    // pass children through so text shows up when your components use ThemeProvider's Text
    Text: ({ children, ...props }: any) =>
      ReactActual.createElement(RN.Text, props, children),
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

describe("ui components", () => {
  it("AppButton renders as an accessible button with label", () => {
    const { getByLabelText } = render(
      <AppButton title="Go" onPress={jest.fn()} />
    );

    // In your output, AppButton exposes accessibilityLabel="Go"
    expect(getByLabelText("Go")).toBeTruthy();
  });

  it("AppButton does not crash when leftIcon provided", () => {
    const LeftIcon = () => null;
    expect(() =>
      render(<AppButton title="Go" onPress={() => {}} leftIcon={LeftIcon} />)
    ).not.toThrow();
  });

  it("AppAlert renders message and exposes testID for error variant", () => {
    const { getByTestId, getByText } = render(
      <AppAlert variant="error" message="Boom" />
    );

    // Your rendered output shows: testID="app-alert-error"
    expect(getByTestId("app-alert-error")).toBeTruthy();
    expect(getByText("Boom")).toBeTruthy();
  });

  it("AppBadge renders without crashing", () => {
    expect(() => render(<AppBadge label="NEW" />)).not.toThrow();
  });

  it("AppInput calls onChangeText", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <AppInput testID="my-input" value="" onChangeText={onChangeText} />
    );

    getByTestId("my-input").props.onChangeText("hello");
    expect(onChangeText).toHaveBeenCalledWith("hello");
  });

  it("AppTextarea calls onChangeText", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <AppTextarea testID="my-ta" value="" onChangeText={onChangeText} />
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

  it("AppCard renders base styles", () => {
    const { getByTestId } = render(<AppCard testID="card" />);

    const card = getByTestId("card");
    const flat = StyleSheet.flatten(card.props.style);

    expect(flat.borderWidth).toBe(2);
    expect(flat.borderRadius).toBe(16);
    expect(flat.padding).toBe(16);
  });
});
