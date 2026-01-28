import 'package:flutter/material.dart';
import 'app_dropdown_menu.dart';

class AppMenubar extends StatelessWidget {
  final List<AppMenubarMenu> menus;

  const AppMenubar({super.key, required this.menus});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Container(
      height: 40,
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        color: cs.surface,
        border: Border.all(color: theme.dividerColor),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (final m in menus)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2),
              child: AppDropdownMenuButton(
                trigger: _MenubarTrigger(text: m.label),
                entries: m.entries,
              ),
            ),
        ],
      ),
    );
  }
}

class AppMenubarMenu {
  final String label;
  final List<AppMenuEntry> entries;

  const AppMenubarMenu({required this.label, required this.entries});
}

class _MenubarTrigger extends StatelessWidget {
  final String text;
  const _MenubarTrigger({required this.text});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700),
      ),
    );
  }
}
