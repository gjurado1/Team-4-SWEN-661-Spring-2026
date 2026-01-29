import 'package:flutter/material.dart';

class AppCheckbox extends StatelessWidget {
  final String? label;
  final bool checked;
  final ValueChanged<bool> onChange;
  final bool disabled;

  const AppCheckbox({
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

    final border = theme.dividerColor;
    final bgSurface = cs.surface;

    final bg = checked ? cs.primary : bgSurface;
    final stroke = checked ? cs.primary : border;

    final box = AnimatedContainer(
      duration: const Duration(milliseconds: 120),
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: stroke, width: 2),
      ),
      child: checked
          ? const Icon(Icons.check, size: 18, color: Colors.white)
          : null,
    );

    final row = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        box,
        if (label != null) ...[
          const SizedBox(width: 12),
          Text(label!, style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600)),
        ],
      ],
    );

    return Opacity(
      opacity: disabled ? 0.5 : 1,
      child: InkWell(
        onTap: disabled ? null : () => onChange(!checked),
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: row,
        ),
      ),
    );
  }
}
