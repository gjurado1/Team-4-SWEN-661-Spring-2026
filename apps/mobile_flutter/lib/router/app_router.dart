import 'package:go_router/go_router.dart';

// Import your screens
import '../pages/login_page.dart';
import '../pages/forgot_password_page.dart';
import '../pages/register_page.dart';

import '../pages/caregiver_dashboard.dart';
import '../pages/patient_dashboard.dart';
import '../pages/patient_list_page.dart';
import '../pages/schedule_page.dart';
import '../pages/patient_checkin_page.dart';
import '../pages/symptoms_page.dart';
import '../pages/medications_page.dart';
import '../pages/reports_page.dart';
import '../pages/messages_page.dart';
import '../pages/settings_page.dart';
import '../pages/profile_page.dart';
import '../pages/emergency_page.dart';

// Your layout (the Flutter version you created)
import '../widgets/navigation/app_layout.dart';

GoRouter buildRouter() {
  return GoRouter(
    initialLocation: '/login',

    routes: [
      // Auth routes (NO BottomNav) — matches routes.ts
      GoRoute(path: '/', builder: (context, state) => const LoginPage()),
      GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
      GoRoute(
          path: '/forgot-password',
          builder: (context, state) => const ForgotPasswordPage()),
      GoRoute(
          path: '/register', builder: (context, state) => const RegisterPage()),

      // App routes (WITH BottomNav) — AppLayout wraps children
      ShellRoute(
        builder: (context, state, child) {
          // AppLayout expects currentPath + onNavigate + child
          return AppLayout(
            currentPath: state.uri.toString(),
            onNavigate: (path, {bool push = false}) {
              if (push) {
                context.push(path);
              } else {
                context.go(path);
              }
            },
            child: child,
          );
        },
        routes: [
          // Caregiver
          GoRoute(
              path: '/caregiver/dashboard',
              builder: (c, s) => const CaregiverDashboard()),
          GoRoute(
              path: '/caregiver/patients',
              builder: (c, s) => const PatientListPage()),
          GoRoute(
              path: '/caregiver/schedule',
              builder: (c, s) => const SchedulePage()),

          // Patient
          GoRoute(
              path: '/patient/dashboard',
              builder: (c, s) => const PatientDashboard()),
          GoRoute(
              path: '/patient/checkin',
              builder: (c, s) => const PatientCheckInPage()),
          GoRoute(
              path: '/patient/symptoms',
              builder: (c, s) => const SymptomsPage()),
          GoRoute(
              path: '/patient/medications',
              builder: (c, s) => const MedicationsPage()),
          GoRoute(
              path: '/patient/reports', builder: (c, s) => const ReportsPage()),

          // Shared
          GoRoute(path: '/messages', builder: (c, s) => const MessagesPage()),
          GoRoute(path: '/settings', builder: (c, s) => const SettingsPage()),
          GoRoute(path: '/profile', builder: (c, s) => const ProfilePage()),
          GoRoute(path: '/emergency', builder: (c, s) => const EmergencyPage()),
        ],
      ),
    ],

    // Fallback == React path: "*" → LoginPage
    errorBuilder: (context, state) => const LoginPage(),
  );
}
