import 'package:flutter/material.dart';

class AppHoverCard extends StatefulWidget {
  final Widget trigger;
  final Widget content;
  final double width;
  final EdgeInsetsGeometry padding;

  const AppHoverCard({
    super.key,
    required this.trigger,
    required this.content,
    this.width = 256, // ~w-64
    this.padding = const EdgeInsets.all(16),
  });

  @override
  State<AppHoverCard> createState() => _AppHoverCardState();
}

class _AppHoverCardState extends State<AppHoverCard> {
  final _link = LayerLink();
  OverlayEntry? _entry;

  void _show() {
    if (_entry != null) return;

    _entry = OverlayEntry(
      builder: (context) {
        final theme = Theme.of(context);
        final cs = theme.colorScheme;

        return Positioned.fill(
          child: Stack(
            children: [
              // click-outside
              GestureDetector(
                onTap: _hide,
                behavior: HitTestBehavior.translucent,
                child: const SizedBox.expand(),
              ),
              CompositedTransformFollower(
                link: _link,
                followerAnchor: Alignment.topCenter,
                targetAnchor: Alignment.bottomCenter,
                offset: const Offset(0, 8),
                child: Material(
                  color: Colors.transparent,
                  child: Container(
                    width: widget.width,
                    padding: widget.padding,
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
  }

  void _hide() {
    _entry?.remove();
    _entry = null;
  }

  @override
  void dispose() {
    _hide();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CompositedTransformTarget(
      link: _link,
      child: MouseRegion(
        onEnter: (_) => _show(),
        onExit: (_) => _hide(),
        child: GestureDetector(
          onLongPress: _show,
          child: widget.trigger,
        ),
      ),
    );
  }
}
