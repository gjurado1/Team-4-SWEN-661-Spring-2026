import 'package:flutter/material.dart';
import 'bottom_nav.dart';

class AppLayout extends StatelessWidget {
  final Widget child;
  final String currentPath;

  /// Use this to navigate (Navigator, GoRouter, etc.)
  final void Function(String path, {bool push}) onNavigate;

  const AppLayout({
    super.key,
    required this.child,
    required this.currentPath,
    required this.onNavigate,
  });

  bool get _hideNav =>
      currentPath == '/' ||
      currentPath == '/login' ||
      currentPath == '/register' ||
      currentPath == '/forgot-password';

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(child: child),
        if (!_hideNav)
          Align(
            alignment: Alignment.bottomCenter,
            child: BottomNav(
              currentPath: currentPath,
              onNavigate: onNavigate,
            ),
          ),
      ],
    );
  }
}
