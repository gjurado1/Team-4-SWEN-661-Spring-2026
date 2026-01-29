import 'package:flutter/material.dart';

enum AppButtonVariant { primary, secondary, destructive }

class AppButton extends StatelessWidget {
  final AppButtonVariant variant;
  final VoidCallback? onPressed;
  final Widget child;
  final Widget? icon;
  final bool expand;

  const AppButton({
    super.key,
    required this.variant,
    required this.onPressed,
    required this.child,
    this.icon,
    this.expand = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    late Color bg;
    late Color fg;
    late Color border;

    switch (variant) {
      case AppButtonVariant.primary:
        bg = cs.primary;
        fg = Colors.white;
        border = cs.primary;
        break;
      case AppButtonVariant.secondary:
        bg = cs.surface;
        fg = cs.onSurface;
        border = theme.dividerColor;
        break;
      case AppButtonVariant.destructive:
        bg = cs.error;
        fg = Colors.white;
        border = cs.error;
        break;
    }

    final content = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (icon != null) ...[
          IconTheme(data: IconThemeData(color: fg, size: 20), child: icon!),
          const SizedBox(width: 8),
        ],
        DefaultTextStyle(
          style: TextStyle(color: fg, fontWeight: FontWeight.w700),
          child: child,
        ),
      ],
    );

    final button = ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: bg,
        foregroundColor: fg,
        elevation: variant == AppButtonVariant.secondary ? 0 : 2,
        minimumSize: const Size(48, 48),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(color: border, width: 2),
        ),
      ),
      child: content,
    );

    return expand ? SizedBox(width: double.infinity, child: button) : button;
  }
}
