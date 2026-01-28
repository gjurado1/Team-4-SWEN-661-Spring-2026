import 'package:flutter/material.dart';

class AppNavigationMenu extends StatelessWidget {
  final List<AppNavigationMenuItem> items;

  const AppNavigationMenu({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: items,
    );
  }
}

class AppNavigationMenuItem extends StatefulWidget {
  final Widget trigger;
  final Widget content;
  final double contentWidth;

  const AppNavigationMenuItem({
    super.key,
    required this.trigger,
    required this.content,
    this.contentWidth = 320,
  });

  @override
  State<AppNavigationMenuItem> createState() => _AppNavigationMenuItemState();
}

class _AppNavigationMenuItemState extends State<AppNavigationMenuItem> {
  final _link = LayerLink();
  OverlayEntry? _entry;

  void _open() {
    if (_entry != null) return;

    _entry = OverlayEntry(
      builder: (context) {
        final theme = Theme.of(context);
        final cs = theme.colorScheme;

        return Positioned.fill(
          child: Stack(
            children: [
              GestureDetector(onTap: _close, child: const SizedBox.expand()),
              CompositedTransformFollower(
                link: _link,
                targetAnchor: Alignment.bottomLeft,
                followerAnchor: Alignment.topLeft,
                offset: const Offset(0, 8),
                child: Material(
                  color: Colors.transparent,
                  child: Container(
                    width: widget.contentWidth,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: cs.surface,
                      border: Border.all(color: theme.dividerColor),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: const [BoxShadow(blurRadius: 12, offset: Offset(0, 8))],
                    ),
                    child: widget.content,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );

    Overlay.of(context).insert(_entry!);
    setState(() {});
  }

  void _close() {
    _entry?.remove();
    _entry = null;
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isOpen = _entry != null;

    return CompositedTransformTarget(
      link: _link,
      child: MouseRegion(
        onEnter: (_) => _open(),
        onExit: (_) => _close(),
        child: InkWell(
          onTap: isOpen ? _close : _open,
          borderRadius: BorderRadius.circular(10),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                widget.trigger,
                const SizedBox(width: 6),
                AnimatedRotation(
                  duration: const Duration(milliseconds: 180),
                  turns: isOpen ? 0.5 : 0.0,
                  child: const Icon(Icons.expand_more, size: 16),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
