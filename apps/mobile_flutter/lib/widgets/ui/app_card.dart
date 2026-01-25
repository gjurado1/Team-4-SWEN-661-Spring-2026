import 'package:flutter/material.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;

  const AppCard({
    super.key,
    required this.child,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white, // --bg-surface
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: const Color(0xFFCBD5E0), // --border
            width: 2,
          ),
        ),
        child: child,
      ),
    );
  }
}
