import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { renderWithProviders } from "../test-utils/renderWithProviders";
import { LoginScreen } from "./LoginScreen";

// --- navigation mock ---
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// --- auth mock (since your screen uses useAuth()) ---
const mockLoginAs = jest.fn();

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    role: null,
    loginAs: mockLoginAs,
    logout: jest.fn(),
  }),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLoginAs.mockClear();
  });

  it("shows error when missing fields", () => {
    const { getByLabelText, getByTestId, getByText } = renderWithProviders(<LoginScreen />);

    fireEvent.press(getByLabelText("Sign In"));

    expect(getByTestId("app-alert-error")).toBeTruthy();
    expect(getByText("Please enter both username and password.")).toBeTruthy();
  });


  it("navigates to Register", () => {
    const { getByLabelText } = renderWithProviders(<LoginScreen />);

    fireEvent.press(getByLabelText("Create Account"));
    expect(mockNavigate).toHaveBeenCalledWith("Register");
  });

  it("navigates to ForgotPassword", () => {
    const { getByLabelText } = renderWithProviders(<LoginScreen />);

    fireEvent.press(getByLabelText("Forgot Password?"));
    expect(mockNavigate).toHaveBeenCalledWith("ForgotPassword");
  });
});
