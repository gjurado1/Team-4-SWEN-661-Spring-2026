import 'package:flutter/material.dart';

enum AppSpinnerSize { sm, md, lg }

class AppSpinner extends StatelessWidget {
  final AppSpinnerSize size;
  final Color? color;

  const AppSpinner({
    super.key,
    this.size = AppSpinnerSize.md,
    this.color,
  });

  double get _px => switch (size) {
        AppSpinnerSize.sm => 16,
        AppSpinnerSize.md => 32,
        AppSpinnerSize.lg => 48,
      };

  double get _stroke => switch (size) {
        AppSpinnerSize.sm => 2,
        AppSpinnerSize.md => 3,
        AppSpinnerSize.lg => 4,
      };

  @override
  Widget build(BuildContext context) {
    final c = color ?? Theme.of(context).colorScheme.primary;
    return SizedBox(
      width: _px,
      height: _px,
      child: CircularProgressIndicator(
        strokeWidth: _stroke,
        valueColor: AlwaysStoppedAnimation<Color>(c),
      ),
    );
  }
}
