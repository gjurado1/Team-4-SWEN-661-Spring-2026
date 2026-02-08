/* eslint-env jest */

import React from "react";
import { renderWithProviders } from "../test-utils/renderWithProviders";

const mockNavigate = jest.fn();
const mockReset = jest.fn();
const mockGoBack = jest.fn();

// ✅ Mock react-navigation hooks
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: mockReset,
    goBack: mockGoBack,
    dispatch: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    key: "mock-route",
    name: "MockRoute",
    params: {},
  }),
}));

// ✅ Mock AuthContext hook so screens don’t require AuthProvider
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    role: "patient",
    login: jest.fn(),
    loginAs: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe("screens smoke", () => {
  it("renders LoginScreen without crashing", () => {
    const { LoginScreen } = require("./LoginScreen");
    expect(() => renderWithProviders(<LoginScreen />)).not.toThrow();
  });

  it("renders RegisterScreen without crashing", () => {
    const { RegisterScreen } = require("./RegisterScreen");
    expect(() => renderWithProviders(<RegisterScreen />)).not.toThrow();
  });

  it("renders ForgotPasswordScreen without crashing", () => {
    const { ForgotPasswordScreen } = require("./ForgotPasswordScreen");
    expect(() => renderWithProviders(<ForgotPasswordScreen />)).not.toThrow();
  });

  it("renders CaregiverDashboardScreen without crashing", () => {
    const { CaregiverDashboardScreen } = require("./CaregiverDashboardScreen");
    expect(() => renderWithProviders(<CaregiverDashboardScreen />)).not.toThrow();
  });

  it("renders PatientDashboardScreen without crashing", () => {
    const { PatientDashboardScreen } = require("./PatientDashboardScreen");
    expect(() => renderWithProviders(<PatientDashboardScreen />)).not.toThrow();
  });

  it("renders PatientListScreen without crashing", () => {
    const { PatientListScreen } = require("./PatientListScreen");
    expect(() => renderWithProviders(<PatientListScreen />)).not.toThrow();
  });

  it("renders PatientCheckInScreen without crashing", () => {
    const { PatientCheckInScreen } = require("./PatientCheckInScreen");
    expect(() => renderWithProviders(<PatientCheckInScreen />)).not.toThrow();
  });

  it("renders ScheduleScreen without crashing", () => {
    const { ScheduleScreen } = require("./ScheduleScreen");
    expect(() => renderWithProviders(<ScheduleScreen />)).not.toThrow();
  });
});
