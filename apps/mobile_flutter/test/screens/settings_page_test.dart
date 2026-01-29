import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_flutter/pages/settings_page.dart';
import '../helpers/test_harness.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('Settings renders voice feature toggles', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const SettingsPage()));
    await tester.pumpAndSettle();

    expect(find.byKey(SettingsPage.readAloudKey), findsOneWidget);
    expect(find.byKey(SettingsPage.voiceCommandsKey), findsOneWidget);
    expect(find.byKey(SettingsPage.voiceRemindersKey), findsOneWidget);
  });

  testWidgets('Toggling Read Aloud changes switch state', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const SettingsPage()));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(SettingsPage.readAloudKey));
    await tester.pump();

    // Switch should now be ON
    final switchWidget = tester.widget<Switch>(find.byKey(SettingsPage.readAloudKey));
    expect(switchWidget.value, true);
  });

  testWidgets('Reset button opens reset dialog', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const SettingsPage()));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(SettingsPage.resetButtonKey));
    await tester.pumpAndSettle();

    expect(find.textContaining('Reset'), findsWidgets);
  });

  testWidgets('Cancel closes reset dialog', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const SettingsPage()));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(SettingsPage.resetButtonKey));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(SettingsPage.resetCancelKey));
    await tester.pumpAndSettle();

    expect(find.byKey(SettingsPage.resetCancelKey), findsNothing);
  });

  testWidgets('Confirm reset shows snackbar', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const SettingsPage()));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(SettingsPage.resetButtonKey));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(SettingsPage.resetConfirmKey));
    await tester.pumpAndSettle();

    expect(find.textContaining('reset'), findsWidgets);
  });
}
