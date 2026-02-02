import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/pages/settings_page.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';
import '../helpers/test_harness.dart';

void main() {
  // Use a large size to avoid "off-screen" tap failures
  const double wideWidth = 1080;
  const double tallHeight = 2500;

  group('SettingsPage Comprehensive Tests', () {
    Future<void> setupPrefs({String role = 'caregiver'}) async {
      SharedPreferences.setMockInitialValues({
        'careconnect-role': role,
        'careconnect-read-aloud': true,
      });
    }

    testWidgets('Loads settings from SharedPreferences on init',
        (tester) async {
      await setupPrefs();
      await tester.pumpWidget(createTestHarness(child: const SettingsPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Voice Features'));
      await tester.pumpAndSettle();

      final readAloudSwitch = find.byType(Switch).first;
      expect(tester.widget<Switch>(readAloudSwitch).value, isTrue);
    });

    testWidgets('Toggling switches updates state', (tester) async {
      await setupPrefs();
      await tester.pumpWidget(createTestHarness(child: const SettingsPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Voice Features'));
      await tester.pumpAndSettle();

      final voiceCommandsSwitch = find.byType(Switch).at(1);
      await tester.tap(voiceCommandsSwitch);
      await tester.pumpAndSettle();

      expect(tester.widget<Switch>(voiceCommandsSwitch).value, isTrue);
    });

    testWidgets('Reset All Settings shows dialog and clears data',
        (tester) async {
      // Set tall viewport
      tester.view.physicalSize = const Size(wideWidth, tallHeight);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await setupPrefs();
      await tester.pumpWidget(createTestHarness(child: const SettingsPage()));
      await tester.pumpAndSettle();

      final resetBtn = find.text('Reset All Settings');
      await tester.ensureVisible(resetBtn);
      await tester.tap(resetBtn);
      await tester.pumpAndSettle();

      expect(find.text('Reset All Settings?'), findsOneWidget);
      await tester.tap(find.text('Reset Settings'));
      await tester.pumpAndSettle();

      expect(find.text('Settings reset to defaults.'), findsOneWidget);
    });

    testWidgets('Sections (Account/General) expand and show nav items',
        (tester) async {
      tester.view.physicalSize = const Size(wideWidth, tallHeight);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestHarness(child: const SettingsPage()));
      await tester.pumpAndSettle();

      final accountSection = find.text('Account Settings');
      await tester.ensureVisible(accountSection);
      await tester.tap(accountSection);
      await tester.pumpAndSettle();

      expect(find.text('Profile Information'), findsOneWidget);
    });
  });
}
