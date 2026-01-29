import 'package:flutter/material.dart';

enum AppPopoverAlign { start, center, end }
enum AppPopoverSide { top, right, bottom, left }

class AppPopover extends StatefulWidget {
  final Widget trigger;
  final Widget content;

  final AppPopoverAlign align;
  final AppPopoverSide side;
  final double sideOffset;

  final double width;
  final EdgeInsetsGeometry padding;

  const AppPopover({
    super.key,
    required this.trigger,
    required this.content,
    this.align = AppPopoverAlign.center,
    this.side = AppPopoverSide.bottom,
    this.sideOffset = 4,
    this.width = 288, // w-72
    this.padding = const EdgeInsets.all(16),
  });

  @override
  State<AppPopover> createState() => _AppPopoverState();
}

class _AppPopoverState extends State<AppPopover> {
  final LayerLink _link = LayerLink();
  OverlayEntry? _entry;

  void _toggle() => _entry == null ? _open() : _close();

  void _open() {
    if (_entry != null) return;

    _entry = OverlayEntry(
      builder: (context) {
        final theme = Theme.of(context);
        final cs = theme.colorScheme;

        final (Alignment targetAnchor, Alignment followerAnchor, Offset offset) =
            _anchors(widget.side, widget.align, widget.sideOffset);

        return Positioned.fill(
          child: Stack(
            children: [
              // click-outside closes
              GestureDetector(
                behavior: HitTestBehavior.translucent,
                onTap: _close,
                child: const SizedBox.expand(),
              ),
              CompositedTransformFollower(
                link: _link,
                targetAnchor: targetAnchor,
                followerAnchor: followerAnchor,
                offset: offset,
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
    setState(() {});
  }

  void _close() {
    _entry?.remove();
    _entry = null;
    if (mounted) setState(() {});
  }

  (Alignment, Alignment, Offset) _anchors(AppPopoverSide side, AppPopoverAlign align, double gap) {
    Alignment alignTo(Alignment start, Alignment center, Alignment end) {
      return switch (align) {
        AppPopoverAlign.start => start,
        AppPopoverAlign.center => center,
        AppPopoverAlign.end => end,
      };
    }

    switch (side) {
      case AppPopoverSide.bottom:
        return (
          alignTo(Alignment.bottomLeft, Alignment.bottomCenter, Alignment.bottomRight),
          alignTo(Alignment.topLeft, Alignment.topCenter, Alignment.topRight),
          Offset(0, gap)
        );
      case AppPopoverSide.top:
        return (
          alignTo(Alignment.topLeft, Alignment.topCenter, Alignment.topRight),
          alignTo(Alignment.bottomLeft, Alignment.bottomCenter, Alignment.bottomRight),
          Offset(0, -gap)
        );
      case AppPopoverSide.left:
        return (
          alignTo(Alignment.topLeft, Alignment.centerLeft, Alignment.bottomLeft),
          alignTo(Alignment.topRight, Alignment.centerRight, Alignment.bottomRight),
          Offset(-gap, 0)
        );
      case AppPopoverSide.right:
        return (
          alignTo(Alignment.topRight, Alignment.centerRight, Alignment.bottomRight),
          alignTo(Alignment.topLeft, Alignment.centerLeft, Alignment.bottomLeft),
          Offset(gap, 0)
        );
    }
  }

  @override
  void dispose() {
    _close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CompositedTransformTarget(
      link: _link,
      child: InkWell(
        onTap: _toggle,
        borderRadius: BorderRadius.circular(10),
        child: widget.trigger,
      ),
    );
  }
}
