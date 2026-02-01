import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../helpers/pump_app.dart';
void main() {
  group('Auth Flow (widget)', () {
    testWidgets('Login page renders core UI', (tester) async {
      await pumpCareConnectApp(tester);
      expect(find.text('Sign In'), findsWidgets);
      expect(find.byKey(const Key('login_username')), findsOneWidget);
      expect(find.byKey(const Key('login_password')), findsOneWidget);
      expect(find.byKey(const Key('login_signin_button')), findsOneWidget);
      expect(find.byKey(const Key('login_demo_patient')).first, findsOneWidget);
      expect(find.byKey(const Key('login_demo_caregiver')).first, findsOneWidget);
    });
    testWidgets('Empty submit shows validation error', (tester) async {
      await pumpCareConnectApp(tester);
      await tester.tap(find.byKey(const Key('login_signin_button')));
      await tester.pumpAndSettle();
      expect(find.text('Please enter both username and password.'), findsOneWidget);
    });
    testWidgets('Invalid credentials show error', (tester) async {
      await pumpCareConnectApp(tester);
      await tester.enterText(find.byKey(const Key('login_username')), 'wronguser');
      await tester.enterText(find.byKey(const Key('login_password')), 'wrongpass');
      await tester.tap(find.byKey(const Key('login_signin_button')));
      await tester.pumpAndSettle();
      expect(find.text('Invalid username or password. Please try again.'), findsOneWidget);
    });
    testWidgets('Caregiver demo tile navigates to caregiver dashboard', (tester) async {
      await pumpCareConnectApp(tester);
      final caregiverTile = find.byKey(const Key('login_demo_caregiver')).first;
    await tester.ensureVisible(caregiverTile);
      await tester.pumpAndSettle();
      await tester.tap(caregiverTile);
    await tester.pumpAndSettle();
      // Caregiver dashboard has "Welcome back"
      expect(find.text('Welcome back'), findsOneWidget);
    });
    testWidgets('Patient demo tile navigates to patient dashboard', (tester) async {
      await pumpCareConnectApp(tester);
      final patientTile = find.byKey(const Key('login_demo_patient')).first;
    await tester.ensureVisible(patientTile);
      await tester.pumpAndSettle();
      await tester.tap(patientTile);
    await tester.pumpAndSettle();
      // Patient dashboard has "Daily Check-In"
      expect(find.text('Menu'), findsOneWidget);
    });
    testWidgets('Caregiver username routes to caregiver dashboard', (tester) async {
      await pumpCareConnectApp(tester);
      await tester.enterText(find.byKey(const Key('login_username')), 'caregiver1');
      await tester.enterText(find.byKey(const Key('login_password')), 'anything');
      await tester.tap(find.byKey(const Key('login_signin_button')));
      await tester.pumpAndSettle();
      expect(find.text('Welcome back'), findsOneWidget);
    });
    testWidgets('Patient username routes to patient dashboard', (tester) async {
      await pumpCareConnectApp(tester);
      await tester.enterText(find.byKey(const Key('login_username')), 'patient1');
      await tester.enterText(find.byKey(const Key('login_password')), 'anything');
      await tester.tap(find.byKey(const Key('login_signin_button')));
      await tester.pumpAndSettle();
      expect(find.text('Menu'), findsOneWidget);
    });
    testWidgets('Role is stored in SharedPreferences after caregiver demo login', (tester) async {
      await pumpCareConnectApp(tester);
      final caregiverTile = find.byKey(const Key('login_demo_caregiver')).first;
    await tester.ensureVisible(caregiverTile);
      await tester.pumpAndSettle();
      await tester.tap(caregiverTile);
    await tester.pumpAndSettle();
      final prefs = await SharedPreferences.getInstance();
      expect(prefs.getString('careconnect-role'), equals('caregiver'));
    });
    testWidgets('Role is stored in SharedPreferences after patient demo login', (tester) async {
      await pumpCareConnectApp(tester);
      final patientTile = find.byKey(const Key('login_demo_patient')).first;
    await tester.ensureVisible(patientTile);
      await tester.pumpAndSettle();
      await tester.tap(patientTile);
    await tester.pumpAndSettle();
      final prefs = await SharedPreferences.getInstance();
      expect(prefs.getString('careconnect-role'), equals('patient'));
    });
    testWidgets('Unknown route falls back to Login page', (tester) async {
      final router = await pumpCareConnectApp(tester);
      router.go('/this-route-does-not-exist');
      await tester.pumpAndSettle();
      // errorBuilder returns LoginPage
      expect(find.text('Sign In'), findsWidgets);
    });
  });
}












