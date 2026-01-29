import 'package:flutter/material.dart';

class AppToggle extends StatelessWidget {
  final String? label;
  final bool checked;
  final ValueChanged<bool> onChange;
  final bool disabled;

  const AppToggle({
    super.key,
    this.label,
    required this.checked,
    required this.onChange,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final trackColor = checked ? cs.primary : theme.dividerColor;
    const trackW = 56.0; // w-14
    const trackH = 32.0; // h-8
    const thumb = 24.0; // h-6 w-6
    const pad = 4.0;

    final child = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(width: 12),
        ],
        Focus(
          child: Opacity(
            opacity: disabled ? 0.5 : 1,
            child: InkWell(
              onTap: disabled ? null : () => onChange(!checked),
              borderRadius: BorderRadius.circular(999),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 160),
                width: trackW,
                height: trackH,
                padding: const EdgeInsets.all(pad),
                decoration: BoxDecoration(
                  color: trackColor,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: AnimatedAlign(
                  duration: const Duration(milliseconds: 160),
                  alignment: checked ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    width: thumb,
                    height: thumb,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );

    // CSS uses focus:ring-4 focus:ring-[--focus-ring]/30.
    // In Flutter we emulate with a subtle overlay when focused.
    return FocusableActionDetector(
      descendantsAreFocusable: false,
      child: Builder(
        builder: (context) {
          final focused = Focus.of(context).hasFocus;
          return AnimatedContainer(
            duration: const Duration(milliseconds: 120),
            padding: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(999),
              boxShadow: focused
                  ? [
                      BoxShadow(
                        blurRadius: 0,
                        spreadRadius: 4,
                        color: cs.primary.withValues(alpha: 0.30),
                      ),
                    ]
                  : null,
            ),
            child: child,
          );
        },
      ),
    );
  }
}
