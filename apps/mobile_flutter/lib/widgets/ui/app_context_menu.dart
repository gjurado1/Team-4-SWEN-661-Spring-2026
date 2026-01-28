import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'app_dropdown_menu.dart';

class AppContextMenuRegion extends StatelessWidget {
  final Widget child;
  final List<AppMenuEntry> entries;

  const AppContextMenuRegion({
    super.key,
    required this.child,
    required this.entries,
  });

  Future<void> _showAt(BuildContext context, Offset globalPos) async {
    final overlay = Overlay.of(context).context.findRenderObject() as RenderBox;

    final selected = await showMenu<_AppMenuAction>(
      context: context,
      position: RelativeRect.fromRect(
        Rect.fromPoints(globalPos, globalPos),
        Offset.zero & overlay.size,
      ),
      items: _buildItems(context, entries),
    );

    selected?.run?.call();
  }

  List<PopupMenuEntry<_AppMenuAction>> _buildItems(
    BuildContext context,
    List<AppMenuEntry> entries,
  ) {
    final theme = Theme.of(context);

    return [
      for (final e in entries)
        if (e is AppMenuSeparator)
          const PopupMenuDivider()
        else if (e is AppMenuLabel)
          PopupMenuItem<_AppMenuAction>(
            enabled: false,
            child: Text(
              e.text,
              style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700),
            ),
          )
        else if (e is AppMenuItem)
          PopupMenuItem<_AppMenuAction>(
            enabled: !e.disabled,
            value: _AppMenuAction(run: e.onTap),
            child: Row(
              children: [
                if (e.leading != null) ...[
                  IconTheme(
                    data: IconThemeData(size: 18, color: theme.hintColor),
                    child: e.leading!,
                  ),
                  const SizedBox(width: 10),
                ],
                Expanded(
                  child: Text(
                    e.text,
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: e.variant == AppMenuItemVariant.destructive
                          ? theme.colorScheme.error
                          : null,
                    ),
                  ),
                ),
                if (e.shortcut != null)
                  Text(
                    e.shortcut!,
                    style: theme.textTheme.bodySmall?.copyWith(letterSpacing: 1.2),
                  ),
              ],
            ),
          ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Listener(
      onPointerDown: (e) {
        // Right-click (desktop/web)
        if (e.kind == PointerDeviceKind.mouse && e.buttons == kSecondaryMouseButton) {
          _showAt(context, e.position);
        }
      },
      child: GestureDetector(
        // Long-press (mobile)
        onLongPressStart: (d) => _showAt(context, d.globalPosition),
        child: child,
      ),
    );
  }
}

class _AppMenuAction {
  final VoidCallback? run;
  const _AppMenuAction({this.run});
}
