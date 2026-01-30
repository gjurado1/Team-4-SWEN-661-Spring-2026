import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/router/app_router.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:mobile_flutter/theme/app_theme_scope.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Basic widget harness (for single pages/widgets)
Widget createTestHarness({
  required Widget child,
  AppThemeController? controller,
}) {
  final c = controller ?? AppThemeController();

  return AppThemeScope(
    controller: c,
    child: MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Builder(
        builder: (context) {
          final mq = MediaQuery.of(context);
          return MediaQuery(
            data: mq.copyWith(textScaler: TextScaler.linear(c.textScaleFactor)),
            child: child,
          );
        },
      ),
    ),
  );
}

/// Sets SharedPreferences mock values (required to exercise BottomNav role logic)
Future<void> setMockPrefs(Map<String, Object> values) async {
  TestWidgetsFlutterBinding.ensureInitialized();
  SharedPreferences.setMockInitialValues(values);
}

/// Full app harness using your real GoRouter + ShellRoute layout.
/// This is the key to getting coverage on:
/// - app_router.dart
/// - app_layout.dart
/// - bottom_nav.dart
/// - navigation flows
Widget createRouterHarness({
  AppThemeController? controller,
}) {
  final c = controller ?? AppThemeController();
  final router = buildRouter();

  return AppThemeScope(
    controller: c,
    child: MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      builder: (context, child) {
        final mq = MediaQuery.of(context);
        return MediaQuery(
          data: mq.copyWith(textScaler: TextScaler.linear(c.textScaleFactor)),
          child: child!,
        );
      },
    ),
  );
}
