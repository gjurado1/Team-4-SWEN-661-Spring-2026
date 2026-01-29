import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_flutter/pages/login_page.dart';
import '../helpers/test_harness.dart';

void main() {
  setUp(() async {
    // makes SharedPreferences predictable in tests
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('Login renders username, password, and sign-in button', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const LoginPage()));
    await tester.pumpAndSettle();

    expect(find.byKey(LoginPage.usernameKey), findsOneWidget);
    expect(find.byKey(LoginPage.passwordKey), findsOneWidget);
    expect(find.byKey(LoginPage.signInKey), findsOneWidget);
  });

  testWidgets('Empty submit shows validation error', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const LoginPage()));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(LoginPage.signInKey));
    await tester.pump(); // allow setState to render error

    expect(find.textContaining('Please enter both'), findsOneWidget);
  });

  testWidgets('Username only shows validation error', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const LoginPage()));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(LoginPage.usernameKey), 'patient');
    await tester.tap(find.byKey(LoginPage.signInKey));
    await tester.pump();

    expect(find.textContaining('Please enter both'), findsOneWidget);
  });

  testWidgets('Password only shows validation error', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const LoginPage()));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(LoginPage.passwordKey), 'password');
    await tester.tap(find.byKey(LoginPage.signInKey));
    await tester.pump();

    expect(find.textContaining('Please enter both'), findsOneWidget);
  });

  testWidgets('Invalid credentials shows error', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const LoginPage()));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(LoginPage.usernameKey), 'wrong');
    await tester.enterText(find.byKey(LoginPage.passwordKey), 'wrong');
    await tester.tap(find.byKey(LoginPage.signInKey));
    await tester.pump();

    expect(find.textContaining('Invalid'), findsOneWidget);
  });

  testWidgets('Forgot password button exists', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const LoginPage()));
    await tester.pumpAndSettle();

    expect(find.byKey(LoginPage.forgotPasswordKey), findsOneWidget);
  });

  testWidgets('Register button exists', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const LoginPage()));
    await tester.pumpAndSettle();

    expect(find.byKey(LoginPage.registerKey), findsOneWidget);
  });

  testWidgets('Accessibility Settings button exists', (tester) async {
    await tester.pumpWidget(createScreenHarness(child: const LoginPage()));
    await tester.pumpAndSettle();

    expect(find.byKey(LoginPage.accessibilitySettingsKey), findsOneWidget);
  });
}
