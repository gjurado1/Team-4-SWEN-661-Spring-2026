import 'package:flutter/material.dart';

enum AppSeparatorOrientation { horizontal, vertical }

class AppSeparator extends StatelessWidget {
  final AppSeparatorOrientation orientation;
  final double thickness;

  const AppSeparator({
    super.key,
    this.orientation = AppSeparatorOrientation.horizontal,
    this.thickness = 1,
  });

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).dividerColor;

    return SizedBox(
      width: orientation == AppSeparatorOrientation.horizontal ? double.infinity : thickness,
      height: orientation == AppSeparatorOrientation.horizontal ? thickness : double.infinity,
      child: DecoratedBox(decoration: BoxDecoration(color: color)),
    );
  }
}
