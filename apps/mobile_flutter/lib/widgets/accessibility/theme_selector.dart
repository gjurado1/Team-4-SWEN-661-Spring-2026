import 'package:flutter/material.dart';
import '../../theme/app_theme_controller.dart';
import '../../theme/app_theme_scope.dart';
import '../../widgets/ui/app_card.dart';

class ThemeSelector extends StatelessWidget {
  const ThemeSelector({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = AppThemeScope.of(context);

    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final themes = <_ThemeOption>[
      const _ThemeOption(
        id: AppVisionTheme.defaultTheme,
        name: 'Soft Blue-Gray',
        description: 'Default high contrast',
        icon: Icons.wb_sunny_outlined,
        previewBg: Color(0xFFF5F7FA),
        previewBorder: Color(0xFF4C6FBC),
      ),
      const _ThemeOption(
        id: AppVisionTheme.darkContrast,
        name: 'True Dark',
        description: 'Maximum contrast',
        icon: Icons.dark_mode_outlined,
        previewBg: Color(0xFF000000),
        previewBorder: Color(0xFF0066FF),
      ),
      const _ThemeOption(
        id: AppVisionTheme.sepia,
        name: 'Low-Glare Sepia',
        description: 'Reduced eye strain',
        icon: Icons.visibility_outlined,
        previewBg: Color(0xFFF4F1E8),
        previewBorder: Color(0xFF8B6F47),
      ),
    ];

    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final active = controller.visionTheme;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Vision Theme',
              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 16),

            LayoutBuilder(
              builder: (context, constraints) {
                final isNarrow = constraints.maxWidth < 700;

                if (isNarrow) {
                  return Column(
                    children: [
                      for (final t in themes) ...[
                        _ThemeCard(
                          option: t,
                          active: active == t.id,
                          onTap: () => controller.setVisionTheme(t.id),
                          highlightColor: cs.primary,
                        ),
                        const SizedBox(height: 12),
                      ],
                    ],
                  );
                }

                return Row(
                  children: [
                    for (int i = 0; i < themes.length; i++) ...[
                      Expanded(
                        child: _ThemeCard(
                          option: themes[i],
                          active: active == themes[i].id,
                          onTap: () => controller.setVisionTheme(themes[i].id),
                          highlightColor: cs.primary,
                        ),
                      ),
                      if (i != themes.length - 1) const SizedBox(width: 16),
                    ],
                  ],
                );
              },
            ),
          ],
        );
      },
    );
  }
}

class _ThemeCard extends StatelessWidget {
  final _ThemeOption option;
  final bool active;
  final VoidCallback onTap;
  final Color highlightColor;

  const _ThemeCard({
    required this.option,
    required this.active,
    required this.onTap,
    required this.highlightColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Semantics(
      button: true,
      selected: active,
      label: 'Select ${option.name} theme',
      child: AppCard(
        onTap: onTap,
        padding: const EdgeInsets.all(16),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 140),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            boxShadow: active
                ? [
                    BoxShadow(
                      blurRadius: 0,
                      spreadRadius: 4,
                      color: highlightColor.withValues(alpha: 0.20),
                    ),
                  ]
                : null,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: option.previewBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: option.previewBorder, width: 4),
                ),
                child: Icon(option.icon, size: 32, color: option.previewBorder),
              ),
              const SizedBox(height: 12),
              Text(option.name, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text(
                option.description,
                style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              if (active)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(
                    color: highlightColor,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Center(
                    child: Text(
                      'Active',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ThemeOption {
  final AppVisionTheme id;
  final String name;
  final String description;
  final IconData icon;
  final Color previewBg;
  final Color previewBorder;

  const _ThemeOption({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.previewBg,
    required this.previewBorder,
  });
}
