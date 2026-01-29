import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTextStyles {
  static const fontFamilyFallback = <String>[
    // Matches your system font stack as closely as Flutter allows
    '.SF Pro Text',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
  ];

  static TextTheme textTheme(AppColors c) {
    return TextTheme(
      // h1: 32px, 700, lh ~1.3
      headlineLarge: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.w700,
        height: 1.3,
        color: c.textPrimary,
        fontFamilyFallback: fontFamilyFallback,
      ),
      // h2: 26px, 600
      headlineMedium: TextStyle(
        fontSize: 26,
        fontWeight: FontWeight.w600,
        height: 1.3,
        color: c.textPrimary,
        fontFamilyFallback: fontFamilyFallback,
      ),
      // h3: 22px, 600, lh ~1.4
      headlineSmall: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        height: 1.4,
        color: c.textPrimary,
        fontFamilyFallback: fontFamilyFallback,
      ),

      // body: 18px, lh 1.6
      bodyLarge: TextStyle(
        fontSize: 18,
        height: 1.6,
        color: c.textPrimary,
        fontFamilyFallback: fontFamilyFallback,
      ),
      // secondary text
      bodyMedium: TextStyle(
        fontSize: 18,
        height: 1.6,
        color: c.textSecondary,
        fontFamilyFallback: fontFamilyFallback,
      ),

      // small: 16px
      bodySmall: TextStyle(
        fontSize: 16,
        height: 1.5,
        color: c.textPrimary,
        fontFamilyFallback: fontFamilyFallback,
      ),

      // label: 16px, 500
      labelLarge: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: c.textPrimary,
        fontFamilyFallback: fontFamilyFallback,
      ),
    );
  }
}
