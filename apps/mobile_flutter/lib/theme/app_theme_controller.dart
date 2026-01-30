import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppVisionTheme { defaultTheme, darkContrast, sepia }

class AppThemeController extends ChangeNotifier {
  AppVisionTheme visionTheme = AppVisionTheme.defaultTheme;

  double textScaleFactor = 1.0;
  final double minTextScale = 0.9;
  final double maxTextScale = 1.3;
  final int textScaleDivisions = 4;

  int textSizePercent = 100;
  ThemeMode themeMode = ThemeMode.system;

  /// Loads saved values
  Future<void> loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();

    final savedThemeIndex = prefs.getInt('careconnect-theme') ?? 0;
    themeMode = ThemeMode.values[savedThemeIndex];

    textScaleFactor = prefs.getDouble('careconnect-textsize') ?? 1.0;

    final savedVisionIndex = prefs.getInt('careconnect-vision-theme') ?? 0;
    visionTheme = AppVisionTheme.values[savedVisionIndex];

    notifyListeners();
  }

  void setThemeMode(ThemeMode mode) async {
    themeMode = mode;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('careconnect-theme', mode.index);
  }

  void setTextScale(double value) async {
    textScaleFactor = value;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('careconnect-textsize', value);
  }

  void setVisionTheme(AppVisionTheme t) async {
    visionTheme = t;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('careconnect-vision-theme', t.index);
  }

  /// Sets text size as a percentage (100, 150, 200)
  void setTextSizePercent(int p) async {

    textSizePercent = p;
    // Convert percentage (100, 150, 200) to double (1.0, 1.5, 2.0)
    textScaleFactor = p / 100.0;

    notifyListeners();
    // Save BOTH to prefs so they persist
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('careconnect-text-percent', p);
    await prefs.setDouble('careconnect-textsize', textScaleFactor);
  }

  // ✅ THIS is what makes Sepia actually change the app
  ThemeData get lightTheme {
    switch (visionTheme) {
      case AppVisionTheme.defaultTheme:
        return _softBlueGrayLight();
      case AppVisionTheme.darkContrast:
        // if user selects dark contrast but app is in light mode,
        // still keep it readable; the real dark theme is below
        return _softBlueGrayLight();
      case AppVisionTheme.sepia:
        return _sepiaLight();
    }
  }

  ThemeData get darkTheme {
    switch (visionTheme) {
      case AppVisionTheme.defaultTheme:
        return _defaultDark();
      case AppVisionTheme.darkContrast:
        return _trueDarkContrast();
      case AppVisionTheme.sepia:
        // sepia is usually a light theme; but we can provide a warm-dark variant
        return _sepiaDark();
    }
  }

  ThemeData _softBlueGrayLight() {
    final cs = ColorScheme.fromSeed(
      seedColor: const Color(0xFF4C6FBC),
      brightness: Brightness.light,
      surface: const Color(0xFFF5F7FA),
    );
    return ThemeData(useMaterial3: true, colorScheme: cs);
  }

  ThemeData _sepiaLight() {
    final cs = ColorScheme.fromSeed(
      seedColor: const Color(0xFF8B6F47),
      brightness: Brightness.light,
      surface: const Color(0xFFF4F1E8),
    );
    return ThemeData(useMaterial3: true, colorScheme: cs);
  }

  ThemeData _defaultDark() {
    final cs = ColorScheme.fromSeed(
      seedColor: const Color(0xFF4C6FBC),
      brightness: Brightness.dark,
    );
    return ThemeData(useMaterial3: true, colorScheme: cs);
  }

  ThemeData _trueDarkContrast() {
    // high-contrast dark
    const cs = ColorScheme(
      brightness: Brightness.dark,
      primary: Color(0xFF0066FF),
      onPrimary: Colors.white,
      secondary: Color(0xFF00C2FF),
      onSecondary: Colors.black,
      error: Color(0xFFFF4D4D),
      onError: Colors.black,
      surface: Colors.black,
      onSurface: Colors.white,
    );
    return ThemeData(useMaterial3: true, colorScheme: cs);
  }

  ThemeData _sepiaDark() {
    final cs = ColorScheme.fromSeed(
      seedColor: const Color(0xFF8B6F47),
      brightness: Brightness.dark,
    );
    return ThemeData(useMaterial3: true, colorScheme: cs);
  }
}
