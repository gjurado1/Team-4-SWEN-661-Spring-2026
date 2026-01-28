import 'package:flutter/material.dart';

enum AppDrawerPosition { left, right }

class AppDrawer extends StatelessWidget {
  final bool isOpen;
  final VoidCallback onClose;
  final String? title;
  final Widget child;
  final AppDrawerPosition position;
  final double width;

  const AppDrawer({
    super.key,
    required this.isOpen,
    required this.onClose,
    this.title,
    required this.child,
    this.position = AppDrawerPosition.left,
    this.width = 320,
  });

  @override
  Widget build(BuildContext context) {
    if (!isOpen) return const SizedBox.shrink();

    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final drawer = Material(
      color: cs.surface,
      child: SizedBox(
        width: width,
        child: Column(
          children: [
            if (title != null)
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: theme.dividerColor, width: 2)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        title!,
                        style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
                      ),
                    ),
                    IconButton(
                      tooltip: 'Close drawer',
                      onPressed: onClose,
                      icon: Icon(Icons.close, color: theme.textTheme.bodyMedium?.color),
                    ),
                  ],
                ),
              ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: child,
              ),
            ),
          ],
        ),
      ),
    );

    return Stack(
      children: [
        // Backdrop
        Positioned.fill(
          child: GestureDetector(
            onTap: onClose,
            child: Container(color: Colors.black.withValues(alpha: 0.5)),
          ),
        ),
        // Drawer
        Align(
          alignment: position == AppDrawerPosition.left ? Alignment.centerLeft : Alignment.centerRight,
          child: Container(
            decoration: BoxDecoration(
              boxShadow: const [BoxShadow(blurRadius: 24, spreadRadius: 2, offset: Offset(0, 8))],
              border: Border(
                right: position == AppDrawerPosition.left ? BorderSide(color: theme.dividerColor, width: 2) : BorderSide.none,
                left: position == AppDrawerPosition.right ? BorderSide(color: theme.dividerColor, width: 2) : BorderSide.none,
              ),
            ),
            child: drawer,
          ),
        ),
      ],
    );
  }
}
