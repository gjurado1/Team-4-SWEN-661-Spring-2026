import 'package:flutter/material.dart';

class AppScrollArea extends StatelessWidget {
  final Widget child;
  final ScrollController? controller;
  final Axis scrollDirection;

  const AppScrollArea({
    super.key,
    required this.child,
    this.controller,
    this.scrollDirection = Axis.vertical,
  });

  @override
  Widget build(BuildContext context) {
    final c = controller ?? ScrollController();

    return Scrollbar(
      controller: c,
      thumbVisibility: true,
      child: SingleChildScrollView(
        controller: c,
        scrollDirection: scrollDirection,
        child: child,
      ),
    );
  }
}
