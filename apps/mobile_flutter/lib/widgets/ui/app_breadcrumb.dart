import 'package:flutter/material.dart';

class AppBreadcrumbItem {
  final String label;
  final VoidCallback? onTap;

  const AppBreadcrumbItem({
    required this.label,
    this.onTap,
  });
}

class AppBreadcrumb extends StatelessWidget {
  final List<AppBreadcrumbItem> items;
  final int collapseAfter; // if too many, show … in the middle

  const AppBreadcrumb({
    super.key,
    required this.items,
    this.collapseAfter = 4,
  });

  List<AppBreadcrumbItem> _collapsed() {
    if (items.length <= collapseAfter) return items;
    // Keep first + last 2
    return [
      items.first,
      const AppBreadcrumbItem(label: '…'),
      ...items.sublist(items.length - 2),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final displayItems = _collapsed();

    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: 8,
      runSpacing: 8,
      children: [
        for (int i = 0; i < displayItems.length; i++) ...[
          _Crumb(
            item: displayItems[i],
            linkColor: cs.primary,
          ),
          if (i != displayItems.length - 1)
            Icon(Icons.chevron_right, size: 18, color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.7)),
        ],
      ],
    );
  }
}

class _Crumb extends StatelessWidget {
  final AppBreadcrumbItem item;
  final Color linkColor;

  const _Crumb({required this.item, required this.linkColor});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final isLink = item.onTap != null && item.label != '…';

    final text = Text(
      item.label,
      overflow: TextOverflow.ellipsis,
      style: theme.textTheme.bodySmall?.copyWith(
        fontWeight: isLink ? FontWeight.w600 : FontWeight.w500,
        color: isLink ? linkColor : theme.textTheme.bodyMedium?.color,
      ),
    );

    if (!isLink) return text;

    return InkWell(
      onTap: item.onTap,
      child: text,
    );
  }
}
