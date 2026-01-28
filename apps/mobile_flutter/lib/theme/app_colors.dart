import 'package:flutter/material.dart';

@immutable
class AppColors {
  final Color bgPrimary;
  final Color bgSurface;
  final Color textPrimary;
  final Color textSecondary;
  final Color border;

  final Color buttonPrimary;
  final Color buttonPrimaryHover;
  final Color focusRing;

  final Color statusSuccess;
  final Color statusWarning;
  final Color statusError;

  final Color alertErrorBg;
  final Color alertErrorBorder;

  final Color alertWarningBg;
  final Color alertWarningBorder;

  final Color alertInfoBg;
  final Color alertInfoBorder;

  final Color offlineBg;
  final Color offlineText;

  const AppColors({
    required this.bgPrimary,
    required this.bgSurface,
    required this.textPrimary,
    required this.textSecondary,
    required this.border,
    required this.buttonPrimary,
    required this.buttonPrimaryHover,
    required this.focusRing,
    required this.statusSuccess,
    required this.statusWarning,
    required this.statusError,
    required this.alertErrorBg,
    required this.alertErrorBorder,
    required this.alertWarningBg,
    required this.alertWarningBorder,
    required this.alertInfoBg,
    required this.alertInfoBorder,
    required this.offlineBg,
    required this.offlineText,
  });

  /// Default (Soft Blue-Gray High Contrast)
  static const light = AppColors(
    bgPrimary: Color(0xFFF5F7FA),
    bgSurface: Color(0xFFFFFFFF),
    textPrimary: Color(0xFF1A2332),
    textSecondary: Color(0xFF4A5568),
    border: Color(0xFFCBD5E0),
    buttonPrimary: Color(0xFF4C6FBC),
    buttonPrimaryHover: Color(0xFF3D5A9A),
    focusRing: Color(0xFF4C6FBC),
    statusSuccess: Color(0xFF2F855A),
    statusWarning: Color(0xFFD69E2E),
    statusError: Color(0xFFC53030),
    alertErrorBg: Color(0xFFFED7D7),
    alertErrorBorder: Color(0xFFFC8181),
    alertWarningBg: Color(0xFFFEF5E7),
    alertWarningBorder: Color(0xFFF6C343),
    alertInfoBg: Color(0xFFE6F2FF),
    alertInfoBorder: Color(0xFF90C9FF),
    offlineBg: Color(0xFF2D3748),
    offlineText: Color(0xFFFFFFFF),
  );

  /// Dark Contrast
  static const darkContrast = AppColors(
    bgPrimary: Color(0xFF000000),
    bgSurface: Color(0xFF1A1A1A),
    textPrimary: Color(0xFFFFFFFF),
    textSecondary: Color(0xFFE0E0E0),
    border: Color(0xFF4A4A4A),
    buttonPrimary: Color(0xFF0066FF),
    buttonPrimaryHover: Color(0xFF0052CC),
    focusRing: Color(0xFF00AAFF),
    statusSuccess: Color(0xFF00FF00),
    statusWarning: Color(0xFFFFCC00),
    statusError: Color(0xFFFF3333),
    alertErrorBg: Color(0xFF4D1A1A),
    alertErrorBorder: Color(0xFFFF3333),
    alertWarningBg: Color(0xFF4D4D1A),
    alertWarningBorder: Color(0xFFFFCC00),
    alertInfoBg: Color(0xFF1A2D4D),
    alertInfoBorder: Color(0xFF0066FF),
    offlineBg: Color(0xFF2A2A2A),
    offlineText: Color(0xFFFFFFFF),
  );

  /// Sepia
  static const sepia = AppColors(
    bgPrimary: Color(0xFFF4F1E8),
    bgSurface: Color(0xFFFDF9F0),
    textPrimary: Color(0xFF3D3226),
    textSecondary: Color(0xFF5C5242),
    border: Color(0xFFD4C9B5),
    buttonPrimary: Color(0xFF8B6F47),
    buttonPrimaryHover: Color(0xFF6F5938),
    focusRing: Color(0xFF8B6F47),
    statusSuccess: Color(0xFF5A7A4A),
    statusWarning: Color(0xFFB8882E),
    statusError: Color(0xFFA84432),
    alertErrorBg: Color(0xFFF5E5E0),
    alertErrorBorder: Color(0xFFD4A59A),
    alertWarningBg: Color(0xFFF5F0E0),
    alertWarningBorder: Color(0xFFD4BF9A),
    alertInfoBg: Color(0xFFE8EFF4),
    alertInfoBorder: Color(0xFFB5CCD9),
    offlineBg: Color(0xFF5C5242),
    offlineText: Color(0xFFFDF9F0),
  );
}
