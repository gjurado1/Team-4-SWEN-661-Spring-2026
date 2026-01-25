import 'dart:ui';
import 'package:flutter/material.dart';

enum AlertType { error, warning, info }

class AppAlert extends StatelessWidget {
  final AlertType type;
  final Widget child;
  final VoidCallback? onClose;

  const AppAlert({
    super.key,
    required this.type,
    required this.child,
    this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    Color backgroundColor;
    Color borderColor;
    IconData icon;
    Color iconColor;

    switch (type) {
      case AlertType.error:
        backgroundColor = const Color(0xFFFED7D7); // --alert-error-bg
        borderColor = const Color(0xFFFC8181); // --alert-error-border
        icon = Icons.warning_amber_rounded;
        iconColor = const Color(0xFFC53030); // --status-error
        break;
      case AlertType.warning:
        backgroundColor = const Color(0xFFFEF5E7); // --alert-warning-bg
        borderColor = const Color(0xFFF6C343); // --alert-warning-border
        icon = Icons.warning_amber_rounded;
        iconColor = const Color(0xFFD69E2E); // --status-warning
        break;
      case AlertType.info:
        backgroundColor = const Color(0xFFE6F2FF); // --alert-info-bg
        borderColor = const Color(0xFF90C9FF); // --alert-info-border
        icon = Icons.info_outline;
        iconColor = const Color(0xFF4C6FBC); // --button-primary
        break;
    }

    return Semantics(
      role: SemanticsRole.alert,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: backgroundColor,
          border: Border.all(color: borderColor, width: 2),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: iconColor, size: 24),
            const SizedBox(width: 12),

            Expanded(child: child),

            if (onClose != null) ...[
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.close, size: 20),
                onPressed: onClose,
                tooltip: "Dismiss alert",
              ),
            ],
          ],
        ),
      ),
    );
  }
}
