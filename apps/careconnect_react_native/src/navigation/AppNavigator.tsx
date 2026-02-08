import React, { useMemo } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme/ThemeProvider";

import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";

import { CaregiverDashboardScreen } from "../screens/CaregiverDashboardScreen";
import { PatientDashboardScreen } from "../screens/PatientDashboardScreen";
import { PatientListScreen } from "../screens/PatientListScreen";
import { ScheduleScreen } from "../screens/ScheduleScreen";
import { PatientCheckInScreen } from "../screens/PatientCheckInScreen";
import { SymptomsScreen } from "../screens/SymptomsScreen";
import { MedicationsScreen } from "../screens/MedicationsScreen";
import { ReportsScreen } from "../screens/ReportsScreen";
import { MessagesScreen } from "../screens/MessagesScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { EmergencyScreen } from "../screens/EmergencyScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { theme } = useAppTheme();
  const { role } = useAuth();

  const navTheme = useMemo(() => {
    const base = theme.isDark ? DarkTheme : DefaultTheme;

    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        primary: theme.colors.primary,
      },
    };
  }, [theme]);

  const initialRouteName: keyof RootStackParamList = role
    ? role === "caregiver"
      ? "CaregiverDashboard"
      : "PatientDashboard"
    : "Login";

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Caregiver */}
        <Stack.Screen name="CaregiverDashboard" component={CaregiverDashboardScreen} />
        <Stack.Screen name="PatientList" component={PatientListScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />

        {/* Patient */}
        <Stack.Screen name="PatientDashboard" component={PatientDashboardScreen} />
        <Stack.Screen name="PatientCheckIn" component={PatientCheckInScreen} />
        <Stack.Screen name="Symptoms" component={SymptomsScreen} />
        <Stack.Screen name="Medications" component={MedicationsScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />

        {/* Shared */}
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
