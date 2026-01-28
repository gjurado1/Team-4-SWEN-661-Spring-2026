import 'package:flutter/material.dart';

enum AppVisionTheme { defaultTheme, darkContrast, sepia }

class AppThemeController extends ChangeNotifier {
  AppVisionTheme visionTheme = AppVisionTheme.defaultTheme;
  double textScaleFactor = 1.0;
  final double minTextScale = 0.9;
  final double maxTextScale = 1.3;
  final int textScaleDivisions = 4;

  void setTextScale(double value) {
    textScaleFactor = value;
    notifyListeners();
  }

  /// 100 / 150 / 200
  int textSizePercent = 100;

  /// system / light / dark (optional but useful)
  ThemeMode themeMode = ThemeMode.system;

  void setVisionTheme(AppVisionTheme t) {
    visionTheme = t;
    notifyListeners();
  }

  void setTextSizePercent(int p) {
    textSizePercent = p;
    notifyListeners();
  }

  void setThemeMode(ThemeMode mode) {
    themeMode = mode;
    notifyListeners();
  }
}
