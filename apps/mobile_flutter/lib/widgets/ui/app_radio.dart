import 'package:flutter/material.dart';

class AppRadio extends StatelessWidget {
  final String name; // kept for API parity; not used in Flutter
  final String? label;
  final bool checked;
  final VoidCallback onChange;
  final bool disabled;

  const AppRadio({
    super.key,
    required this.name,
    this.label,
    required this.checked,
    required this.onChange,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final borderColor = checked ? cs.primary : theme.dividerColor;

    return Opacity(
      opacity: disabled ? 0.5 : 1,
      child: InkWell(
        onTap: disabled ? null : onChange,
        borderRadius: BorderRadius.circular(10),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 24,
                height: 24,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: borderColor, width: 2),
                      ),
                    ),
                    if (checked)
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: cs.primary,
                        ),
                      ),
                  ],
                ),
              ),
              if (label != null) ...[
                const SizedBox(width: 12),
                Text(label!, style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
