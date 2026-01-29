import 'package:flutter/material.dart';

enum AppAlertVariant { info, warning, error }

class AppAlert extends StatelessWidget {
  final AppAlertVariant variant;
  final Widget child;

  const AppAlert({
    super.key,
    required this.variant,
    required this.child,
  });

  const AppAlert.info({super.key, required this.child}) : variant = AppAlertVariant.info;
  const AppAlert.warning({super.key, required this.child}) : variant = AppAlertVariant.warning;
  const AppAlert.error({super.key, required this.child}) : variant = AppAlertVariant.error;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    Color border;
    Color bg;
    Color fg;
    IconData icon;

    switch (variant) {
      case AppAlertVariant.info:
        border = cs.primary.withValues(alpha: 0.35);
        bg = cs.primary.withValues(alpha: 0.10);
        fg = cs.primary;
        icon = Icons.info_outline;
        break;
      case AppAlertVariant.warning:
        border = const Color(0xFFF6C343);
        bg = const Color(0xFFFEF5E7);
        fg = const Color(0xFFD69E2E);
        icon = Icons.warning_amber_outlined;
        break;
      case AppAlertVariant.error:
        border = const Color(0xFFFC8181);
        bg = const Color(0xFFFED7D7);
        fg = cs.error;
        icon = Icons.error_outline;
        break;
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: border, width: 2),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: fg, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: DefaultTextStyle.merge(
              style: theme.textTheme.bodyMedium?.copyWith(color: fg, fontWeight: FontWeight.w600),
              child: child,
            ),
          ),
        ],
      ),
    );
  }
}
