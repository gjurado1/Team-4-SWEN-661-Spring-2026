import 'package:flutter/material.dart';
import 'app_dialog.dart';

class AppCommandItem {
  final String id;
  final String title;
  final String? subtitle;
  final String? shortcut;
  final Widget? leading;
  final VoidCallback onSelect;
  final bool disabled;

  const AppCommandItem({
    required this.id,
    required this.title,
    required this.onSelect,
    this.subtitle,
    this.shortcut,
    this.leading,
    this.disabled = false,
  });
}

class AppCommandGroup {
  final String title;
  final List<AppCommandItem> items;
  const AppCommandGroup({required this.title, required this.items});
}

class AppCommandDialog {
  static Future<void> show(
    BuildContext context, {
    String title = 'Command Palette',
    String description = 'Search for a command to run...',
    required List<AppCommandGroup> groups,
  }) {
    return AppDialog.show<void>(
      context,
      barrierDismissible: true,
      content: _CommandDialogBody(title: title, description: description, groups: groups),
    );
  }
}

class _CommandDialogBody extends StatefulWidget {
  final String title;
  final String description;
  final List<AppCommandGroup> groups;

  const _CommandDialogBody({
    required this.title,
    required this.description,
    required this.groups,
  });

  @override
  State<_CommandDialogBody> createState() => _CommandDialogBodyState();
}

class _CommandDialogBodyState extends State<_CommandDialogBody> {
  final _controller = TextEditingController();
  String _q = '';

  @override
  void initState() {
    super.initState();
    _controller.addListener(() => setState(() => _q = _controller.text.trim().toLowerCase()));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  bool _match(AppCommandItem item) {
    if (_q.isEmpty) return true;
    final hay = '${item.title} ${item.subtitle ?? ''}'.toLowerCase();
    return hay.contains(_q);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final filtered = [
      for (final g in widget.groups)
        AppCommandGroup(
          title: g.title,
          items: [for (final it in g.items) if (_match(it)) it],
        ),
    ].where((g) => g.items.isNotEmpty).toList();

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Hidden header in TSX; in Flutter we show it (you can remove if you want)
        AppDialogHeader(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AppDialogTitle(widget.title),
              const SizedBox(height: 6),
              AppDialogDescription(widget.description),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Input wrapper with search icon
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            border: Border(bottom: BorderSide(color: theme.dividerColor)),
          ),
          child: Row(
            children: [
              Icon(Icons.search, size: 18, color: theme.hintColor),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: const InputDecoration(
                    hintText: 'Search…',
                    border: InputBorder.none,
                  ),
                ),
              ),
            ],
          ),
        ),

        ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 300),
          child: filtered.isEmpty
              ? const Padding(
                  padding: EdgeInsets.all(24),
                  child: Center(child: Text('No results found.')),
                )
              : ListView.builder(
                  shrinkWrap: true,
                  itemCount: filtered.fold<int>(0, (sum, g) => sum + 1 + g.items.length),
                  itemBuilder: (ctx, idx) {
                    int cursor = 0;
                    for (final g in filtered) {
                      if (idx == cursor) {
                        return Padding(
                          padding: const EdgeInsets.fromLTRB(8, 12, 8, 6),
                          child: Text(g.title, style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700)),
                        );
                      }
                      cursor++;
                      final within = idx - cursor;
                      if (within < g.items.length) {
                        final it = g.items[within];
                        return _CommandRow(
                          item: it,
                          onSelect: () {
                            if (it.disabled) return;
                            Navigator.of(context).maybePop();
                            it.onSelect();
                          },
                        );
                      }
                      cursor += g.items.length;
                    }
                    return const SizedBox.shrink();
                  },
                ),
        ),
      ],
    );
  }
}

class _CommandRow extends StatelessWidget {
  final AppCommandItem item;
  final VoidCallback onSelect;

  const _CommandRow({required this.item, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Opacity(
      opacity: item.disabled ? 0.5 : 1,
      child: ListTile(
        dense: true,
        enabled: !item.disabled,
        onTap: item.disabled ? null : onSelect,
        leading: item.leading,
        title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: item.subtitle == null ? null : Text(item.subtitle!),
        trailing: item.shortcut == null
            ? null
            : Text(item.shortcut!, style: theme.textTheme.bodySmall?.copyWith(letterSpacing: 1.2)),
      ),
    );
  }
}
