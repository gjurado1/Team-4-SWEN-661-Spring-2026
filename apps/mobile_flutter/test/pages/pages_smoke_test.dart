import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/pages/caregiver_dashboard.dart';
import 'package:mobile_flutter/pages/emergency_page.dart';
import 'package:mobile_flutter/pages/login_page.dart';
import 'package:mobile_flutter/pages/medications_page.dart';
import 'package:mobile_flutter/pages/messages_page.dart';
import 'package:mobile_flutter/pages/patient_dashboard.dart';
import 'package:mobile_flutter/pages/profile_page.dart';
import 'package:mobile_flutter/pages/schedule_page.dart';
import 'package:mobile_flutter/pages/settings_page.dart';

import '../helpers/test_harness.dart';

void main() {
  group('Smoke: pages render', () {
    testWidgets('LoginPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();
      expect(find.byType(LoginPage), findsOneWidget);
    });

    testWidgets('CaregiverDashboard renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const CaregiverDashboard()));
      await tester.pumpAndSettle();
      expect(find.byType(CaregiverDashboard), findsOneWidget);
    });

    testWidgets('PatientDashboard renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const PatientDashboard()));
      await tester.pumpAndSettle();
      expect(find.byType(PatientDashboard), findsOneWidget);
    });

    testWidgets('SettingsPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SettingsPage()));
      await tester.pumpAndSettle();
      expect(find.byType(SettingsPage), findsOneWidget);
    });

    testWidgets('EmergencyPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();
      expect(find.byType(EmergencyPage), findsOneWidget);
    });

    testWidgets('MessagesPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const MessagesPage()));
      await tester.pumpAndSettle();
      expect(find.byType(MessagesPage), findsOneWidget);
    });

    testWidgets('MedicationsPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const MedicationsPage()));
      await tester.pumpAndSettle();
      expect(find.byType(MedicationsPage), findsOneWidget);
    });

    testWidgets('ProfilePage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const ProfilePage()));
      await tester.pumpAndSettle();
      expect(find.byType(ProfilePage), findsOneWidget);
    });

    testWidgets('SchedulePage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SchedulePage()));
      await tester.pumpAndSettle();
      expect(find.byType(SchedulePage), findsOneWidget);
    });
  });
}
