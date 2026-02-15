import React from "react";
import { View, Text as RNText } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { MessagesScreen } from "./MessagesScreen";

/**
 * Mock layout + UI wrappers so we don't need AuthProvider / navigation.
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
      scroll?: boolean;
    }) => <View testID={testID ?? "mock-screen-container"}>{children}</View>,
  };
});

jest.mock("../components/ui/PageHeader", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <View>
      <Text>{title}</Text>
      {subtitle ? <Text>{subtitle}</Text> : null}
    </View>
  );
  return { __esModule: true, PageHeader: Header, default: Header };
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
    }) => <View accessibilityLabel={accessibilityLabel}>{children}</View>,
  };
});

/**
 * Mock AppTextarea and AppButton to behave like simple interactive controls.
 * - AppTextarea: renders a Text + a faux "input" we can fire changeText on via testID
 * - AppButton: renders a pressable text node with the title we can press
 */
jest.mock("../components/ui/AppTextarea", () => {
  const React = require("react");
  const { View, Text, Pressable } = require("react-native");
  return {
    __esModule: true,
    AppTextarea: ({
      label,
      value,
      onChangeText,
    }: {
      label: string;
      value: string;
      onChangeText: (t: string) => void;
      placeholder?: string;
    }) => (
      <View>
        <Text>{label}</Text>
        {/* Simulate a text input surface */}
        <Pressable
          testID="mock-textarea"
          accessibilityRole="textbox"
          accessibilityLabel={label}
          onPress={() => onChangeText(value)}
        >
          <Text testID="mock-textarea-value">{value}</Text>
        </Pressable>
      </View>
    ),
  };
});

jest.mock("../components/ui/AppButton", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");
  return {
    __esModule: true,
    AppButton: ({
      title,
      onPress,
      accessibilityHint,
    }: {
      title: string;
      onPress: () => void;
      expand?: boolean;
      accessibilityHint?: string;
    }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        testID={`mock-button-${title}`}
      >
        <Text>{title}</Text>
      </Pressable>
    ),
  };
});

/**
 * ThemeProvider exports Text + useAppTheme; mock them to keep rendering simple.
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
          border: "#999",
          surfaceAlt: "#eee",
          textMuted: "#666",
        },
      },
    }),
  };
});

describe("MessagesScreen", () => {
  it("renders header, threads list, and compose section", () => {
    const { getByTestId, getByText, getByLabelText } = render(<MessagesScreen />);

    expect(getByTestId("messages-screen")).toBeTruthy();

    expect(getByText("Messages")).toBeTruthy();
    expect(getByText("Secure messaging")).toBeTruthy();

    // Cards by accessibility label
    expect(getByLabelText("Message threads")).toBeTruthy();
    expect(getByLabelText("Compose message")).toBeTruthy();

    // Seed threads are visible
    expect(getByText("Sarah Johnson")).toBeTruthy();
    expect(getByText("Robert Chen")).toBeTruthy();
    expect(getByText("Care Team")).toBeTruthy();

    // Selected default is id "1" => Sarah Johnson
    expect(getByText("To: Sarah Johnson")).toBeTruthy();

    // Unread badge should show for Sarah initially
    expect(getByText("NEW")).toBeTruthy();
  });

  it("selecting a thread updates the compose 'To:' and clears NEW for that thread", () => {
    const { getByText, queryByText, getByLabelText } = render(<MessagesScreen />);

    // Switch to Robert Chen thread
    fireEvent.press(getByLabelText("Open thread with Robert Chen"));

    expect(getByText("To: Robert Chen")).toBeTruthy();

    // The only initial NEW was on Sarah; after selecting Robert (which was unread=false),
    // NEW should still be gone if Sarah was marked read earlier? Actually we didn't open Sarah;
    // Sarah starts unread=true and remains so until opened.
    // So we should see NEW still (for Sarah) at this point.
    expect(getByText("NEW")).toBeTruthy();

    // Now open Sarah to mark it read
    fireEvent.press(getByLabelText("Open thread with Sarah Johnson"));

    expect(getByText("To: Sarah Johnson")).toBeTruthy();
    // Sarah should be marked read now, so NEW should disappear.
    expect(queryByText("NEW")).toBeNull();
  });

  it("sending a non-empty message updates the selected thread last message and clears draft", () => {
    const { getByText, getByTestId } = render(<MessagesScreen />);

    // Ensure we are on Sarah thread
    expect(getByText("To: Sarah Johnson")).toBeTruthy();

    // Type draft text by firing changeText on our mocked textarea
    // Since AppTextarea is mocked, we can directly call onChangeText via fireEvent:
    fireEvent(getByTestId("mock-textarea"), "press");
    fireEvent(getByTestId("mock-textarea"), "changeText", "Hello Sarah!");

    // Some RN test envs won't route changeText to Pressable; do it safely by re-firing:
    // @testing-library/react-native supports fireEvent(element, 'changeText', value)
    fireEvent(getByTestId("mock-textarea"), "changeText", "Hello Sarah!");

    // Press Send
    fireEvent.press(getByTestId("mock-button-Send"));

    // Last message should update for selected thread
    expect(getByText("Hello Sarah!")).toBeTruthy();

    // Draft should clear (our mock shows value text node)
    expect(getByTestId("mock-textarea-value").props.children).toBe("");
  });

  it("does not send when draft is empty/whitespace", () => {
    const { getByText, getByTestId } = render(<MessagesScreen />);

    // Sarah's initial last message exists
    expect(getByText("Thanks, I feel better today.")).toBeTruthy();

    // Set draft to whitespace
    fireEvent(getByTestId("mock-textarea"), "changeText", "   ");

    // Press Send
    fireEvent.press(getByTestId("mock-button-Send"));

    // Last message should remain unchanged
    expect(getByText("Thanks, I feel better today.")).toBeTruthy();
  });
});
