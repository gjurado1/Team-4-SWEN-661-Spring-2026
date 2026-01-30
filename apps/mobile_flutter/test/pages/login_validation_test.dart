import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/pages/login_page.dart';

import '../helpers/test_harness.dart';

void main() {
  group('LoginPage: validation & interaction', () {
    testWidgets('renders email + password fields by Key', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('login-email')), findsOneWidget);
      expect(find.byKey(const Key('login-password')), findsOneWidget);
      expect(find.byKey(const Key('login-submit')), findsOneWidget);
    });

    testWidgets('submit with empty fields shows validation message', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('login-submit')));
      await tester.pumpAndSettle();

      // Your UI should show at least one error Text. Use a stable key for the error.
      expect(find.byKey(const Key('login-error')), findsOneWidget);
    });

    testWidgets('invalid email shows validation error', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();

      await tester.enterText(find.byKey(const Key('login-email')), 'not-an-email');
      await tester.enterText(find.byKey(const Key('login-password')), 'password123');
      await tester.tap(find.byKey(const Key('login-submit')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('login-error')), findsOneWidget);
    });

    testWidgets('typing in fields updates TextField values', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();

      await tester.enterText(find.byKey(const Key('login-email')), 'test@example.com');
      await tester.enterText(find.byKey(const Key('login-password')), 'pw');

      final emailField = tester.widget<TextField>(find.byKey(const Key('login-email')));
      final passField = tester.widget<TextField>(find.byKey(const Key('login-password')));

      expect(emailField.controller?.text ?? '', 'test@example.com');
      expect(passField.controller?.text ?? '', 'pw');
    });

    testWidgets('forgot password button exists + can be tapped', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('login-forgot')), findsOneWidget);
      await tester.tap(find.byKey(const Key('login-forgot')));
      await tester.pump(); // tapping should not crash
      expect(find.byType(LoginPage), findsOneWidget);
    });

    testWidgets('register button exists + can be tapped', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('login-register')), findsOneWidget);
      await tester.tap(find.byKey(const Key('login-register')));
      await tester.pump(); // tapping should not crash
      expect(find.byType(LoginPage), findsOneWidget);
    });
  });
}
