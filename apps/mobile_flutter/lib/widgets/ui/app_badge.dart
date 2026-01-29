import 'package:flutter/material.dart';

enum AppBadgeVariant { success, warning, error }

class AppBadge extends StatelessWidget {
  final AppBadgeVariant variant;
  final String text;

  const AppBadge({
    super.key,
    required this.variant,
    required this.text,
  });

  const AppBadge.success({super.key, required this.text})
      : variant = AppBadgeVariant.success;

  const AppBadge.warning({super.key, required this.text})
      : variant = AppBadgeVariant.warning;

  const AppBadge.error({super.key, required this.text})
      : variant = AppBadgeVariant.error;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    late Color bg;
    late Color fg;

    switch (variant) {
      case AppBadgeVariant.success:
        bg = const Color(0xFF2F855A);
        fg = Colors.white;
        break;
      case AppBadgeVariant.warning:
        bg = const Color(0xFFD69E2E);
        fg = Colors.white;
        break;
      case AppBadgeVariant.error:
        bg = cs.error;
        fg = Colors.white;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text.toUpperCase(),
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.6,
        ),
      ),
    );
  }
}
