import 'package:flutter/material.dart';

class AppTabItem {
  final String id;
  final String label;
  final Widget content;

  const AppTabItem({required this.id, required this.label, required this.content});
}

class AppTabs extends StatefulWidget {
  final List<AppTabItem> tabs;
  final String? initialId;

  const AppTabs({super.key, required this.tabs, this.initialId});

  @override
  State<AppTabs> createState() => _AppTabsState();
}

class _AppTabsState extends State<AppTabs> {
  late String _active;

  @override
  void initState() {
    super.initState();
    _active = widget.initialId ?? widget.tabs.first.id;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final active = widget.tabs.firstWhere((t) => t.id == _active);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // TabsList
        Container(
          height: 36,
          padding: const EdgeInsets.all(3),
          decoration: BoxDecoration(
            color: cs.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              for (final t in widget.tabs)
                _TabTrigger(
                  label: t.label,
                  active: t.id == _active,
                  onTap: () => setState(() => _active = t.id),
                ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        // TabsContent
        Focus(
          child: active.content,
        ),
      ],
    );
  }
}

class _TabTrigger extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _TabTrigger({required this.label, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: active ? cs.surface : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: active ? theme.dividerColor : Colors.transparent),
        ),
        child: Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            fontWeight: FontWeight.w600,
            color: active ? cs.onSurface : theme.hintColor,
          ),
        ),
      ),
    );
  }
}
