import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsScreen } from "./SettingsScreen";

/* -------------------- MOCK NAVIGATION -------------------- */

const mockGoBack = jest.fn();
const mockReset = jest.fn();
const mockNavigate = jest.fn();
const mockCanGoBack = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    reset: mockReset,
    navigate: mockNavigate,
    canGoBack: mockCanGoBack,
  }),
}));

/* -------------------- MOCK ASYNC STORAGE -------------------- */

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

/* -------------------- MOCK THEME PROVIDER -------------------- */

jest.mock("../theme/ThemeProvider", () => {
  const React = require("react");
  return {
    useAppTheme: () => ({
      theme: {
        colors: {
          background: "#fff",
          surface: "#fff",
          surfaceAlt: "#eee",
          border: "#ccc",
          primary: "#007AFF",
          textMuted: "#999",
        },
      },
      textScale: 1,
    }),
    Text: ({ children }: any) => <>{children}</>,
  };
});

/* -------------------- MOCK CHILD COMPONENTS -------------------- */

jest.mock("../components/navigation/AppLayout", () => ({
  AppLayout: ({ children }: any) => <>{children}</>,
}));

jest.mock("../components/ScreenContainer", () => ({
  ScreenContainer: ({ children }: any) => <>{children}</>,
}));

jest.mock("../components/ui/AppCard", () => ({
  AppCard: ({ children }: any) => <>{children}</>,
}));

jest.mock("../components/ui/AppButton", () => ({
  AppButton: ({ title, onPress, accessibilityLabel }: any) => {
    const React = require("react");
    const { Pressable, Text } = require("react-native");
    return (
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel || title}>
        <Text>{title}</Text>
      </Pressable>
    );
  },
}));

jest.mock("../components/ui/PageHeader", () => ({
  PageHeader: () => null,
}));

jest.mock("../components/accessibility/ThemeSelector", () => () => null);
jest.mock("../components/accessibility/TextSizeControl", () => () => null);
jest.mock("../components/ui/SettingsPanel", () => ({
  SettingsPanel: ({ children }: any) => <>{children}</>,
}));

/* ========================================================= */

describe("SettingsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* -------------------- BACK NAVIGATION -------------------- */

  it("goes back if navigation stack exists", async () => {
    mockCanGoBack.mockReturnValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(<SettingsScreen />);

    fireEvent.press(getByText("Back"));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("navigates based on role if cannot go back", async () => {
    mockCanGoBack.mockReturnValue(false);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("caregiver");

    const { getByText } = render(<SettingsScreen />);

    fireEvent.press(getByText("Back"));

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: "CaregiverDashboard" }],
      });
    });
  });

  /* -------------------- TOGGLES -------------------- */

  it("toggles Read Aloud and persists value", async () => {
    mockCanGoBack.mockReturnValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByLabelText } = render(<SettingsScreen />);

    fireEvent.press(getByLabelText("Read Aloud"));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "careconnect-read-aloud",
        "true"
      );
    });
  });

  it("toggles Screen Reader Support and persists value", async () => {
    mockCanGoBack.mockReturnValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByLabelText } = render(<SettingsScreen />);

    fireEvent.press(getByLabelText("Screen Reader Support"));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "careconnect-screen-reader",
        "true"
      );
    });
  });

  /* -------------------- RESET DIALOG -------------------- */

  it("opens reset dialog and reset removes expected keys", async () => {
    mockCanGoBack.mockReturnValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByLabelText, queryByLabelText, getAllByText } = render(
      <SettingsScreen />
    );

    // Open dialog
    fireEvent.press(getByLabelText("Reset all settings"));
    expect(
      getByLabelText("Reset all settings confirmation")
    ).toBeTruthy();

    // Confirm reset
    fireEvent.press(getAllByText("Reset Settings")[0]);

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "careconnect-theme"
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "careconnect-textsize"
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "careconnect-read-aloud"
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "careconnect-screen-reader"
      );
    });

    // Dialog closed
    expect(
      queryByLabelText("Reset all settings confirmation")
    ).toBeNull();
  });

  it("Cancel in reset dialog closes dialog without removing keys", async () => {
    mockCanGoBack.mockReturnValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByLabelText, getAllByText, queryByLabelText } = render(
      <SettingsScreen />
    );

    fireEvent.press(getByLabelText("Reset all settings"));
    expect(
      getByLabelText("Reset all settings confirmation")
    ).toBeTruthy();

    fireEvent.press(getAllByText("Cancel")[0]);

    expect(
      queryByLabelText("Reset all settings confirmation")
    ).toBeNull();

    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });
});
