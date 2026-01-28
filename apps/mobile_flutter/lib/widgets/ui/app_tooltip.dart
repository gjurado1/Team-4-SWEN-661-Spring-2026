import 'package:flutter/material.dart';

enum AppTooltipSide { top, right, bottom, left }

class AppTooltip extends StatefulWidget {
  final Widget child; // trigger
  final Widget content;
  final AppTooltipSide side;
  final double sideOffset;
  final Duration showDelay;

  const AppTooltip({
    super.key,
    required this.child,
    required this.content,
    this.side = AppTooltipSide.top,
    this.sideOffset = 6,
    this.showDelay = Duration.zero,
  });

  @override
  State<AppTooltip> createState() => _AppTooltipState();
}

class _AppTooltipState extends State<AppTooltip> {
  final _link = LayerLink();
  OverlayEntry? _entry;
  bool _hovering = false;

  void _scheduleShow() async {
    _hovering = true;
    if (widget.showDelay > Duration.zero) {
      await Future.delayed(widget.showDelay);
      if (!_hovering) return;
    }
    _show();
  }

  void _show() {
    if (_entry != null) return;

    _entry = OverlayEntry(
      builder: (context) {
        final theme = Theme.of(context);
        final cs = theme.colorScheme;

        final (Alignment targetAnchor, Alignment followerAnchor, Offset offset) = switch (widget.side) {
          AppTooltipSide.top => (Alignment.topCenter, Alignment.bottomCenter, Offset(0, -widget.sideOffset)),
          AppTooltipSide.bottom => (Alignment.bottomCenter, Alignment.topCenter, Offset(0, widget.sideOffset)),
          AppTooltipSide.left => (Alignment.centerLeft, Alignment.centerRight, Offset(-widget.sideOffset, 0)),
          AppTooltipSide.right => (Alignment.centerRight, Alignment.centerLeft, Offset(widget.sideOffset, 0)),
        };

        return Positioned.fill(
          child: IgnorePointer(
            ignoring: true,
            child: CompositedTransformFollower(
              link: _link,
              targetAnchor: targetAnchor,
              followerAnchor: followerAnchor,
              offset: offset,
              child: Material(
                color: Colors.transparent,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: cs.primary,
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: const [BoxShadow(blurRadius: 10, offset: Offset(0, 6))],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: DefaultTextStyle(
                      style: theme.textTheme.bodySmall?.copyWith(
                            color: cs.onPrimary,
                            fontWeight: FontWeight.w600,
                          ) ??
                          TextStyle(color: cs.onPrimary),
                      child: widget.content,
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );

    Overlay.of(context).insert(_entry!);
  }

  void _hide() {
    _hovering = false;
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
        onEnter: (_) => _scheduleShow(),
        onExit: (_) => _hide(),
        child: GestureDetector(
          onLongPressStart: (_) => _show(),
          onLongPressEnd: (_) => _hide(),
          child: widget.child,
        ),
      ),
    );
  }
}
