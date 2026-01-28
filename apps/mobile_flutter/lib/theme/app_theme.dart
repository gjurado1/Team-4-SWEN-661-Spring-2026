import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_text_styles.dart';

class AppTheme {
  static ThemeData fromColors(AppColors c, {required Brightness brightness}) {
    final base = ThemeData(
      useMaterial3: true,
      brightness: brightness,
    );

    final textTheme = AppTextStyles.textTheme(c);

    final colorScheme = ColorScheme.fromSeed(
      seedColor: c.buttonPrimary,
      brightness: brightness,
      primary: c.buttonPrimary,
      surface: c.bgSurface,
      onSurface: c.textPrimary,
      background: c.bgPrimary,
      onBackground: c.textPrimary,
      error: c.statusError,
      onError: Colors.white,
    );

    final outline = c.border;

    // Inputs: 2px border, 8 radius, min height ~48
    final inputBorder = OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: outline, width: 2),
    );

    final focusedInputBorder = OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: c.buttonPrimary, width: 2),
    );

    final errorInputBorder = OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: c.statusError, width: 2),
    );

    return base.copyWith(
      scaffoldBackgroundColor: c.bgPrimary,
      colorScheme: colorScheme,
      textTheme: textTheme,

      dividerColor: outline,

      // Global focus ring (approx. your outline: 3px solid focus-ring)
      focusColor: c.focusRing,

      // Card/Suface defaults (your surface/card utilities)
      cardTheme: CardThemeData(
        color: c.bgSurface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: outline, width: 2),
        ),
        margin: EdgeInsets.zero,
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: c.bgSurface,
        hintStyle: textTheme.bodyLarge?.copyWith(
          color: c.textSecondary.withValues(alpha: 0.7),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        border: inputBorder,
        enabledBorder: inputBorder,
        focusedBorder: focusedInputBorder,
        errorBorder: errorInputBorder,
        focusedErrorBorder: errorInputBorder,
      ),

      // Buttons (primary + "secondary" outline style)
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ButtonStyle(
          minimumSize: const WidgetStatePropertyAll(Size(120, 48)),
          padding: const WidgetStatePropertyAll(
            EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          ),
          shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.disabled)) {
              return c.buttonPrimary.withValues(alpha: 0.5);
            }
            if (states.contains(WidgetState.hovered) ||
                states.contains(WidgetState.pressed)) {
              return c.buttonPrimaryHover;
            }
            return c.buttonPrimary;
          }),
          foregroundColor: const WidgetStatePropertyAll(Colors.white),
          textStyle: WidgetStatePropertyAll(
            textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
          ),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: ButtonStyle(
          minimumSize: const WidgetStatePropertyAll(Size(120, 48)),
          padding: const WidgetStatePropertyAll(
            EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          ),
          shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
          side: WidgetStateProperty.resolveWith((states) {
            final color = (states.contains(WidgetState.hovered) ||
                    states.contains(WidgetState.pressed))
                ? c.buttonPrimary
                : outline;
            return BorderSide(color: color, width: 2);
          }),
          foregroundColor: WidgetStatePropertyAll(c.textPrimary),
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.hovered) ||
                states.contains(WidgetState.pressed)) {
              return c.bgPrimary;
            }
            return Colors.transparent;
          }),
          textStyle: WidgetStatePropertyAll(
            textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
          ),
        ),
      ),
    );
  }

  static ThemeData light() =>
      fromColors(AppColors.light, brightness: Brightness.light);
  static ThemeData darkContrast() =>
      fromColors(AppColors.darkContrast, brightness: Brightness.dark);
  static ThemeData sepia() =>
      fromColors(AppColors.sepia, brightness: Brightness.light);
}
