import 'package:flutter/material.dart';

class AppLabel extends StatelessWidget {
  final String text;
  final bool disabled;
  final TextStyle? style;

  const AppLabel({
    super.key,
    required this.text,
    this.disabled = false,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Opacity(
      opacity: disabled ? 0.5 : 1,
      child: Text(
        text,
        style: style ??
            theme.textTheme.labelLarge?.copyWith(
              fontWeight: FontWeight.w500,
            ),
      ),
    );
  }
}
