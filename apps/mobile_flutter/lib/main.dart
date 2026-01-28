import 'package:flutter/material.dart';

import 'package:mobile_flutter/router/app_router.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:mobile_flutter/theme/app_theme_scope.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const _Root());
}

/// Root widget that owns the AppThemeController lifecycle
class _Root extends StatefulWidget {
  const _Root();

  @override
  State<_Root> createState() => _RootState();
}

class _RootState extends State<_Root> {
  late final AppThemeController _themeController;

  @override
  void initState() {
    super.initState();
    _themeController = AppThemeController();

    // Optional (recommended):
    // If your controller loads saved theme / text size from prefs
    // _themeController.loadFromPrefs();
  }

  @override
  void dispose() {
    _themeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppThemeScope(
      controller: _themeController,
      child: AnimatedBuilder(
        animation: _themeController,
        builder: (context, _) {
          return MaterialApp.router(
            debugShowCheckedModeBanner: false,
            routerConfig: buildRouter(),

            // Apply global text scaling (TextSizeControl)
            builder: (context, child) {
              final mediaQuery = MediaQuery.of(context);
              return MediaQuery(
                data: mediaQuery.copyWith(
                  textScaler: TextScaler.linear(_themeController.textScaleFactor),
                ),
                child: child!,
              );
            },

            // Optional: if your controller exposes ThemeData
            // theme: _themeController.lightTheme,
            // darkTheme: _themeController.darkTheme,
            // themeMode: _themeController.themeMode,
          );
        },
      ),
    );
  }
}
