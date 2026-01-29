import 'package:flutter/material.dart';

enum AppLogoSize { sm, md, lg }

class AppLogo extends StatelessWidget {
  final AppLogoSize size;
  final bool showTagline;

  const AppLogo({
    super.key,
    this.size = AppLogoSize.md,
    this.showTagline = false,
  });

  double get _iconSize => switch (size) {
        AppLogoSize.sm => 20,
        AppLogoSize.md => 32,
        AppLogoSize.lg => 40,
      };

  double get _gap => switch (size) {
        AppLogoSize.sm => 8,
        AppLogoSize.md => 12,
        AppLogoSize.lg => 16,
      };

  TextStyle? _titleStyle(BuildContext context) {
    final t = Theme.of(context).textTheme;
    return switch (size) {
      AppLogoSize.sm => t.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
      AppLogoSize.md => t.headlineMedium?.copyWith(fontWeight: FontWeight.w800),
      AppLogoSize.lg => t.headlineLarge?.copyWith(fontWeight: FontWeight.w800),
    };
  }

  TextStyle? _taglineStyle(BuildContext context) {
    final t = Theme.of(context).textTheme;
    return switch (size) {
      AppLogoSize.sm => t.bodySmall?.copyWith(color: t.bodyMedium?.color?.withValues(alpha: 0.8)),
      AppLogoSize.md => t.bodySmall?.copyWith(color: t.bodyMedium?.color?.withValues(alpha: 0.8)),
      AppLogoSize.lg => t.bodyLarge?.copyWith(color: t.bodyMedium?.color?.withValues(alpha: 0.8)),
    };
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: cs.primary,
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.favorite, color: Colors.white, size: _iconSize),
            ),
            SizedBox(width: _gap),
            Text('CareConnect', style: _titleStyle(context)),
          ],
        ),
        if (showTagline) ...[
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'Connect with care, track with confidence',
              textAlign: TextAlign.center,
              style: _taglineStyle(context),
            ),
          ),
        ],
      ],
    );
  }
}
