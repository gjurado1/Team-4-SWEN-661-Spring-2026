import 'package:flutter/material.dart';
import 'package:mobile_flutter/router/app_router.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:mobile_flutter/theme/app_theme_scope.dart';
import 'package:go_router/go_router.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const _Root());
}

class _Root extends StatefulWidget {
  const _Root();

  @override
  State<_Root> createState() => _RootState();
}

class _RootState extends State<_Root> {
  late final AppThemeController _themeController;
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _themeController = AppThemeController();

    // Router is initialized once here to prevent route resets on rebuild
    _router = buildRouter();

    // Load saved preferences (theme mode, vision theme, text scale, etc.)
    _themeController.loadFromPrefs();
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
            routerConfig: _router,

            // ✅ Use controller-driven themes so Sepia/DarkContrast actually apply
            theme: _themeController.lightTheme,
            darkTheme: _themeController.darkTheme,
            themeMode: _themeController.themeMode,

            builder: (context, child) {
              final mediaQuery = MediaQuery.of(context);
              return MediaQuery(
                data: mediaQuery.copyWith(
                  textScaler: TextScaler.linear(_themeController.textScaleFactor),
                ),
                child: child ?? const SizedBox.shrink(),
              );
            },
          );
        },
      ),
    );
  }
}
