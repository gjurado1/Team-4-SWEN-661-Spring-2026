import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/pages/settings_page.dart';
import 'package:mobile_flutter/pages/emergency_page.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';

import '../helpers/test_harness.dart';

void main() {
  group('Settings + Emergency: interactions', () {
    testWidgets('Settings: Vision Theme section opens', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SettingsPage()));
      await tester.pumpAndSettle();

      // Tap the Vision Theme accordion trigger by Key
      await tester.tap(find.byKey(const Key('settings-vision-trigger')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('theme-selector')), findsOneWidget);
    });

    testWidgets('Settings: selecting Sepia changes controller', (tester) async {
      final controller = AppThemeController();
      await tester.pumpWidget(createTestHarness(child: const SettingsPage(), controller: controller));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('settings-vision-trigger')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('theme-option-sepia')));
      await tester.pumpAndSettle();

      expect(controller.visionTheme.toString(), contains('sepia'));
    });

    testWidgets('Settings: Text Size section opens', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SettingsPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('settings-textsize-trigger')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('text-size-control')), findsOneWidget);
    });

    testWidgets('Emergency: tapping SOS opens confirm sheet', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('emergency-sos')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('emergency-confirm-sheet')), findsOneWidget);
      expect(find.byKey(const Key('emergency-confirm-button')), findsOneWidget);
      expect(find.byKey(const Key('emergency-cancel-button')), findsOneWidget);
    });

    testWidgets('Emergency: cancel closes confirm sheet', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('emergency-sos')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('emergency-cancel-button')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('emergency-confirm-sheet')), findsNothing);
    });
  });
}
