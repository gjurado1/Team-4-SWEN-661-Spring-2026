import 'package:flutter/material.dart';

enum AppMenuItemVariant { normal, destructive }

sealed class AppMenuEntry {
  const AppMenuEntry();
}

class AppMenuSeparator extends AppMenuEntry {
  const AppMenuSeparator();
}

class AppMenuLabel extends AppMenuEntry {
  final String text;
  const AppMenuLabel(this.text);
}

class AppMenuItem extends AppMenuEntry {
  final String text;
  final VoidCallback onTap;
  final bool disabled;
  final Widget? leading;
  final String? shortcut;
  final AppMenuItemVariant variant;

  const AppMenuItem({
    required this.text,
    required this.onTap,
    this.disabled = false,
    this.leading,
    this.shortcut,
    this.variant = AppMenuItemVariant.normal,
  });
}

class AppDropdownMenuButton extends StatelessWidget {
  final Widget trigger;
  final List<AppMenuEntry> entries;

  const AppDropdownMenuButton({
    super.key,
    required this.trigger,
    required this.entries,
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<_MenuAction>(
      tooltip: '',
      itemBuilder: (ctx) => _buildItems(ctx, entries),
      onSelected: (action) => action.run?.call(),
      child: trigger,
    );
  }

  List<PopupMenuEntry<_MenuAction>> _buildItems(BuildContext context, List<AppMenuEntry> entries) {
    final theme = Theme.of(context);

    return [
      for (final e in entries)
        if (e is AppMenuSeparator)
          const PopupMenuDivider()
        else if (e is AppMenuLabel)
          PopupMenuItem<_MenuAction>(
            enabled: false,
            child: Text(e.text, style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700)),
          )
        else if (e is AppMenuItem)
          PopupMenuItem<_MenuAction>(
            enabled: !e.disabled,
            value: _MenuAction(run: e.onTap),
            child: Row(
              children: [
                if (e.leading != null) ...[
                  IconTheme(data: IconThemeData(size: 18, color: theme.hintColor), child: e.leading!),
                  const SizedBox(width: 10),
                ],
                Expanded(
                  child: Text(
                    e.text,
                    style: TextStyle(
                      color: e.variant == AppMenuItemVariant.destructive ? theme.colorScheme.error : null,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                if (e.shortcut != null)
                  Text(e.shortcut!, style: theme.textTheme.bodySmall?.copyWith(letterSpacing: 1.2)),
              ],
            ),
          ),
    ];
  }
}

class _MenuAction {
  final VoidCallback? run;
  const _MenuAction({this.run});
}
