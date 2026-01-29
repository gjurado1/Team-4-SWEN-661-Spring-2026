import 'package:flutter/material.dart';

class AppProgress extends StatelessWidget {
  /// 0..100
  final double value;
  final double height;

  const AppProgress({
    super.key,
    required this.value,
    this.height = 8, // your CSS h-2; but earlier tokens use 2; pick 8 for visibility
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final v = value.clamp(0, 100) / 100.0;

    return ClipRRect(
      borderRadius: BorderRadius.circular(999),
      child: Container(
        height: height,
        color: cs.primary.withValues(alpha: 0.20),
        child: Align(
          alignment: Alignment.centerLeft,
          child: FractionallySizedBox(
            widthFactor: v,
            child: Container(color: cs.primary),
          ),
        ),
      ),
    );
  }
}
