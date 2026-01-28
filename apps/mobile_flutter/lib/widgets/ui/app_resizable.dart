import 'package:flutter/material.dart';

enum AppResizableDirection { horizontal, vertical }

class AppResizablePanelGroup extends StatefulWidget {
  final AppResizableDirection direction;
  final Widget first;
  final Widget second;

  /// fraction of available space for first panel (0.1..0.9)
  final double initialFraction;
  final bool withHandle;

  const AppResizablePanelGroup({
    super.key,
    required this.direction,
    required this.first,
    required this.second,
    this.initialFraction = 0.5,
    this.withHandle = true,
  });

  @override
  State<AppResizablePanelGroup> createState() => _AppResizablePanelGroupState();
}

class _AppResizablePanelGroupState extends State<AppResizablePanelGroup> {
  late double _fraction;

  @override
  void initState() {
    super.initState();
    _fraction = widget.initialFraction.clamp(0.1, 0.9);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return LayoutBuilder(
      builder: (context, constraints) {
        final total = widget.direction == AppResizableDirection.horizontal
            ? constraints.maxWidth
            : constraints.maxHeight;

        final firstSize = total * _fraction;
        final secondSize = total - firstSize;

        final handle = _ResizableHandle(
          direction: widget.direction,
          withHandle: widget.withHandle,
          onDelta: (delta) {
            setState(() {
              final next = (firstSize + delta) / total;
              _fraction = next.clamp(0.1, 0.9);
            });
          },
          color: theme.dividerColor,
        );

        if (widget.direction == AppResizableDirection.horizontal) {
          return Row(
            children: [
              SizedBox(width: firstSize, child: widget.first),
              handle,
              SizedBox(width: secondSize, child: widget.second),
            ],
          );
        } else {
          return Column(
            children: [
              SizedBox(height: firstSize, child: widget.first),
              handle,
              SizedBox(height: secondSize, child: widget.second),
            ],
          );
        }
      },
    );
  }
}

class _ResizableHandle extends StatelessWidget {
  final AppResizableDirection direction;
  final bool withHandle;
  final ValueChanged<double> onDelta;
  final Color color;

  const _ResizableHandle({
    required this.direction,
    required this.withHandle,
    required this.onDelta,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final isH = direction == AppResizableDirection.horizontal;

    return MouseRegion(
      cursor: isH ? SystemMouseCursors.resizeColumn : SystemMouseCursors.resizeRow,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onPanUpdate: (d) => onDelta(isH ? d.delta.dx : d.delta.dy),
        child: Container(
          width: isH ? 8 : double.infinity,
          height: isH ? double.infinity : 8,
          alignment: Alignment.center,
          child: Container(
            width: isH ? 1 : double.infinity,
            height: isH ? double.infinity : 1,
            color: color,
            child: withHandle
                ? Center(
                    child: Container(
                      width: isH ? 14 : 40,
                      height: isH ? 40 : 14,
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.25),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: color),
                      ),
                      child: Icon(
                        Icons.drag_indicator,
                        size: 16,
                        color: Theme.of(context).hintColor,
                      ),
                    ),
                  )
                : null,
          ),
        ),
      ),
    );
  }
}
