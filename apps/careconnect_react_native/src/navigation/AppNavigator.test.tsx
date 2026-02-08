import React from "react";
import { render } from "@testing-library/react-native";
import { AppNavigator } from "./AppNavigator";

// Mock NavigationContainer to simply render children
jest.mock("@react-navigation/native", () => ({
  NavigationContainer: ({ children }: any) => children,
  DefaultTheme: { colors: {} },
  DarkTheme: { colors: {} },
}));

// Capture props passed to Stack.Navigator
const mockNavigator = jest.fn();

// Mock native stack
jest.mock("@react-navigation/native-stack", () => ({
  createNativeStackNavigator: () => ({
    Navigator: (props: any) => {
      mockNavigator(props);
      return props.children;
    },
    Screen: () => null,
  }),
}));

// Mock theme hook used by AppNavigator
jest.mock("../theme/ThemeProvider", () => ({
  useAppTheme: () => ({
    theme: {
      mode: "light",
      colors: {
        background: "#fff",
        surface: "#fff",
        text: "#000",
        border: "#ddd",
        primary: "#00f",
      },
    },
  }),
}));

// Mock auth hook used by AppNavigator (context)
jest.mock(
  "../context/AuthContext",
  () => {
    let role: null | "caregiver" | "patient" = null;
    return {
      __setRole: (r: typeof role) => {
        role = r;
      },
      useAuth: () => ({ role }),
    };
  },
  { virtual: true }
);

jest.mock(
  "@/context/AuthContext",
  () => {
    let role: null | "caregiver" | "patient" = null;
    return {
      __setRole: (r: typeof role) => {
        role = r;
      },
      useAuth: () => ({ role }),
    };
  },
  { virtual: true }
);

// If your AppNavigator still imports store in some branch, prevent crashes:
jest.mock(
  "../store/useAuthStore",
  () => {
    let role: any = null;
    return {
      __setRole: (r: any) => {
        role = r;
      },
      useAuthStore: () => ({ role }),
    };
  },
  { virtual: true }
);

describe("AppNavigator", () => {
  beforeEach(() => {
    mockNavigator.mockClear();
  });

  it("uses Login when role is null", () => {
    render(<AppNavigator />);
    expect(mockNavigator).toHaveBeenCalled();
    const call = mockNavigator.mock.calls[0][0];
    expect(call.initialRouteName).toBe("Login");
  });
});
