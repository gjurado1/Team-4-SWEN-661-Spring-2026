import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_flutter/main.dart'; 
// import 'package:mobile_flutter/providers/auth_provider.dart'; // UNCOMMENT if needed

void main() {
  setUp(() async {
    // Reset Shared Preferences before every test
    SharedPreferences.setMockInitialValues({});
  });

  Future<void> pumpAppWithRole(WidgetTester tester, String role) async {
    // 1. Set the mock role in storage
    SharedPreferences.setMockInitialValues({'careconnect-role': role});

    // 2. Pump the widget tree
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          // If your app doesn't check SharedPreferences automatically on startup,
          // you MUST override your AuthProvider here to force the logged-in state.
          // Example:
          // authProvider.overrideWith((ref) => MockAuthProvider(initialRole: role)),
        ],
        child: const CareConnectApp(),
      ),
    );

    // 3. Wait for all animations and redirects to settle
    await tester.pumpAndSettle(const Duration(seconds: 2));
  }

  testWidgets('Bottom nav shows patient items when role=patient', (tester) async {
    await pumpAppWithRole(tester, 'patient');

    // Debugging: If this fails, the app is likely still on the Login Page.
    // print(find.byType(MaterialApp).toString()); 

    expect(find.byKey(const ValueKey('nav_home')), findsOneWidget);
    expect(find.byKey(const ValueKey('nav_check-in')), findsOneWidget);
    expect(find.byKey(const ValueKey('nav_messages')), findsOneWidget);
    expect(find.byKey(const ValueKey('nav_settings')), findsOneWidget);
    expect(find.byKey(const ValueKey('nav_emergency')), findsOneWidget);
    expect(find.byKey(const ValueKey('nav_logout')), findsOneWidget);

    // Caregiver items should NOT appear
    expect(find.byKey(const ValueKey('nav_patient_list')), findsNothing);
    expect(find.byKey(const ValueKey('nav_schedule')), findsNothing);
  });

  testWidgets('Bottom nav shows caregiver items when role=caregiver', (tester) async {
    await pumpAppWithRole(tester, 'caregiver');

    expect(find.byKey(const ValueKey('nav_home')), findsOneWidget);
    expect(find.byKey(const ValueKey('nav_patient_list')), findsOneWidget);
    expect(find.byKey(const ValueKey('nav_schedule')), findsOneWidget);

    // Patient-only items absent
    expect(find.byKey(const ValueKey('nav_check-in')), findsNothing);
    expect(find.byKey(const ValueKey('nav_messages')), findsNothing);
  });

  testWidgets('Tapping settings navigates to settings screen', (tester) async {
    await pumpAppWithRole(tester, 'patient');

    // Tap the settings tab
    await tester.tap(find.byKey(const ValueKey('nav_settings')));
    await tester.pumpAndSettle();

    // Verify Settings Screen is present
    // Note: Use textContaining or find.byType(SettingsPage) if you have the import
    expect(find.textContaining('Settings'), findsOneWidget);
  });

  testWidgets('Tapping messages navigates to messages screen', (tester) async {
    await pumpAppWithRole(tester, 'patient');

    await tester.tap(find.byKey(const ValueKey('nav_messages')));
    await tester.pumpAndSettle();

    expect(find.textContaining('Messages'), findsOneWidget);
  });

  testWidgets('Logout returns to login', (tester) async {
    await pumpAppWithRole(tester, 'patient');

    await tester.tap(find.byKey(const ValueKey('nav_logout')));
    await tester.pumpAndSettle();

    // Verify we are back at the login page
    expect(find.text('Sign In'), findsOneWidget);
  });
}