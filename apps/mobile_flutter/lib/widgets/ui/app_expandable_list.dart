import 'package:flutter/material.dart';

class AppExpandableListItem extends StatefulWidget {
  final String title;
  final Widget child;
  final bool defaultExpanded;

  const AppExpandableListItem({
    super.key,
    required this.title,
    required this.child,
    this.defaultExpanded = false,
  });

  @override
  State<AppExpandableListItem> createState() => _AppExpandableListItemState();
}

class _AppExpandableListItemState extends State<AppExpandableListItem> {
  late bool _open;

  @override
  void initState() {
    super.initState();
    _open = widget.defaultExpanded;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        border: Border.all(color: theme.dividerColor, width: 2),
        borderRadius: BorderRadius.circular(12),
        color: cs.surface,
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          InkWell(
            onTap: () => setState(() => _open = !_open),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: Text(widget.title, style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w700)),
                  ),
                  Icon(_open ? Icons.expand_less : Icons.expand_more, color: theme.hintColor, size: 24),
                ],
              ),
            ),
          ),
          AnimatedSize(
            duration: const Duration(milliseconds: 180),
            curve: Curves.easeOut,
            child: _open
                ? Container(
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    decoration: BoxDecoration(
                      border: Border(top: BorderSide(color: theme.dividerColor, width: 2)),
                      color: cs.surface,
                    ),
                    child: widget.child,
                  )
                : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}
