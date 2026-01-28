import 'package:flutter/material.dart';
import '../../theme/app_theme_scope.dart';
import '../../widgets/ui/app_button.dart';
import '../../widgets/ui/app_card.dart';

/// Flutter version of TextSizeControl.tsx
/// - 3 preset buttons: 100%, 150%, 200%
/// - Highlights active size
/// - Sample text preview
class TextSizeControl extends StatelessWidget {
  const TextSizeControl({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = AppThemeScope.of(context);
    final theme = Theme.of(context);

    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final textSize = controller.textSizePercent; // 100 / 150 / 200

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Buttons row
            Row(
              children: [
                Expanded(
                  child: _SizeButton(
                    label: 'Normal',
                    percent: 100,
                    fontSize: 18,
                    active: textSize == 100,
                    onTap: () => controller.setTextSizePercent(100),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _SizeButton(
                    label: 'Medium',
                    percent: 150,
                    fontSize: 22,
                    active: textSize == 150,
                    onTap: () => controller.setTextSizePercent(150),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _SizeButton(
                    label: 'Large',
                    percent: 200,
                    fontSize: 26,
                    active: textSize == 200,
                    onTap: () => controller.setTextSizePercent(200),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Sample preview
            AppCard(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Sample text at current size: The quick brown fox jumps over the lazy dog.',
                style: theme.textTheme.bodyMedium,
              ),
            ),
          ],
        );
      },
    );
  }
}

class _SizeButton extends StatelessWidget {
  final String label;
  final int percent;
  final double fontSize;
  final bool active;
  final VoidCallback onTap;

  const _SizeButton({
    required this.label,
    required this.percent,
    required this.fontSize,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppButton(
      variant: active ? AppButtonVariant.primary : AppButtonVariant.secondary,
      onPressed: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'Aa',
            style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 6),
          Text(label, style: const TextStyle(fontSize: 14)),
          const SizedBox(height: 4),
          Opacity(
            opacity: 0.7,
            child: Text('$percent%', style: const TextStyle(fontSize: 12)),
          ),
        ],
      ),
    );
  }
}
