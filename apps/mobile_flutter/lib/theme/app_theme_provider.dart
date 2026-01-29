import 'package:flutter/material.dart';
import 'app_theme_controller.dart';

class AppThemeProvider extends InheritedNotifier<AppThemeController> {
  const AppThemeProvider({
    super.key,
    required AppThemeController controller,
    required super.child,
  }) : super(notifier: controller);

  static AppThemeController of(BuildContext context) {
    final provider =
        context.dependOnInheritedWidgetOfExactType<AppThemeProvider>();
    assert(provider != null, 'AppThemeProvider not found in widget tree');
    return provider!.notifier!;
  }
}
