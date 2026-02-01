import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_flutter/router/app_router.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:mobile_flutter/theme/app_theme_scope.dart';
/// Pumps the CareConnect app using the SAME structure as lib/main.dart:
/// AppThemeScope + MaterialApp.router(routerConfig: buildRouter()).
///
/// - prefs: mock SharedPreferences values (role, theme, etc.)
/// - initialLocation: route to navigate to after initial pump
Future<GoRouter> pumpCareConnectApp(
  WidgetTester tester, {
  Map<String, Object> prefs = const {},
  String? initialLocation,
}) async {
  SharedPreferences.setMockInitialValues(prefs);
  final controller = AppThemeController();
  await controller.loadFromPrefs();
  final router = buildRouter();
  addTearDown(controller.dispose);
  await tester.pumpWidget(
    AppThemeScope(
      controller: controller,
      child: AnimatedBuilder(
        animation: controller,
        builder: (context, _) {
          return MaterialApp.router(
            debugShowCheckedModeBanner: false,
            routerConfig: router,
            theme: controller.lightTheme,
            darkTheme: controller.darkTheme,
            themeMode: controller.themeMode,
            builder: (context, child) {
              final mediaQuery = MediaQuery.of(context);
              return MediaQuery(
                data: mediaQuery.copyWith(
                  textScaler: TextScaler.linear(controller.textScaleFactor),
                ),
                child: child ?? const SizedBox.shrink(),
              );
            },
          );
        },
      ),
    ),
  );
  await tester.pumpAndSettle();
  if (initialLocation != null) {
    router.go(initialLocation);
    await tester.pumpAndSettle();
  }
  return router;
}
