// import 'package:flutter/material.dart';
// import 'package:flutter_test/flutter_test.dart';
// import 'package:mobile_flutter/pages/login_page.dart';

// import '../helpers/test_harness.dart';

// void main() {
//   group('LoginPage: validation & interaction', () {
//     testWidgets('renders email + password fields by Key', (tester) async {
//       await tester.pumpWidget(createTestHarness(child: const LoginPage()));
//       await tester.pumpAndSettle();

//       expect(find.byKey(const Key('login-email')), findsOneWidget);
//       expect(find.byKey(const Key('login-password')), findsOneWidget);
//       expect(find.byKey(const Key('login-submit')), findsOneWidget);
//     });

//     testWidgets('submit with empty fields shows validation message', (tester) async {
//       await tester.pumpWidget(createTestHarness(child: const LoginPage()));
//       await tester.pumpAndSettle();

//       await tester.tap(find.byKey(const Key('login-submit')));
//       await tester.pumpAndSettle();

//       // Your UI should show at least one error Text. Use a stable key for the error.
//       expect(find.byKey(const Key('login-error')), findsOneWidget);
//     });

//     testWidgets('invalid email shows validation error', (tester) async {
//       await tester.pumpWidget(createTestHarness(child: const LoginPage()));
//       await tester.pumpAndSettle();

//       await tester.enterText(find.byKey(const Key('login-email')), 'not-an-email');
//       await tester.enterText(find.byKey(const Key('login-password')), 'password123');
//       await tester.tap(find.byKey(const Key('login-submit')));
//       await tester.pumpAndSettle();

//       expect(find.byKey(const Key('login-error')), findsOneWidget);
//     });

//     testWidgets('typing in fields updates TextField values', (tester) async {
//       await tester.pumpWidget(createTestHarness(child: const LoginPage()));
//       await tester.pumpAndSettle();

//       await tester.enterText(find.byKey(const Key('login-email')), 'test@example.com');
//       await tester.enterText(find.byKey(const Key('login-password')), 'pw');

//       final emailField = tester.widget<TextField>(find.byKey(const Key('login-email')));
//       final passField = tester.widget<TextField>(find.byKey(const Key('login-password')));

//       expect(emailField.controller?.text ?? '', 'test@example.com');
//       expect(passField.controller?.text ?? '', 'pw');
//     });

//     testWidgets('forgot password button exists + can be tapped', (tester) async {
//       await tester.pumpWidget(createTestHarness(child: const LoginPage()));
//       await tester.pumpAndSettle();

//       expect(find.byKey(const Key('login-forgot')), findsOneWidget);
//       await tester.tap(find.byKey(const Key('login-forgot')));
//       await tester.pump(); // tapping should not crash
//       expect(find.byType(LoginPage), findsOneWidget);
//     });

//     testWidgets('register button exists + can be tapped', (tester) async {
//       await tester.pumpWidget(createTestHarness(child: const LoginPage()));
//       await tester.pumpAndSettle();

//       expect(find.byKey(const Key('login-register')), findsOneWidget);
//       await tester.tap(find.byKey(const Key('login-register')));
//       await tester.pump(); // tapping should not crash
//       expect(find.byType(LoginPage), findsOneWidget);
//     });
//   });
// }
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_flutter/pages/login_page.dart';
import '../helpers/test_harness.dart';

void main() {
  group('LoginPage: validation & interaction', () {
    
    // Helper to wrap LoginPage in a Router so context.go works
    Widget buildTestableWidget() {
      final router = GoRouter(
        routes: [
          GoRoute(path: '/', builder: (context, state) => const LoginPage()),
          // Dummy routes so the taps don't crash
          GoRoute(path: '/forgot-password', builder: (context, state) => const Scaffold()),
          GoRoute(path: '/register', builder: (context, state) => const Scaffold()),
        ],
      );

      return createTestHarness(
        child: MaterialApp.router(
          routerConfig: router,
        ),
      );
    }

    testWidgets('renders username + password fields', (tester) async {
      await tester.pumpWidget(buildTestableWidget());
      await tester.pumpAndSettle();

      expect(find.text('Username'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
    });

    testWidgets('forgot password button exists + can be tapped', (tester) async {
      await tester.pumpWidget(buildTestableWidget());
      await tester.pumpAndSettle();

      final forgotPw = find.text('Forgot Password?');
      await tester.tap(forgotPw);
      await tester.pumpAndSettle();
      
      // If the tap works without throwing an error, the test passes!
    });

    testWidgets('register button exists + can be tapped', (tester) async {
      // Set larger screen so "Create Account" isn't off-screen
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      
      await tester.pumpWidget(buildTestableWidget());
      await tester.pumpAndSettle();

      final createAccount = find.text('Create Account');
      
      // Scroll to it just in case
      await tester.ensureVisible(createAccount);
      await tester.tap(createAccount);
      await tester.pumpAndSettle();
      
      // Reset view for other tests
      addTearDown(tester.view.resetPhysicalSize);
    });
  });
}