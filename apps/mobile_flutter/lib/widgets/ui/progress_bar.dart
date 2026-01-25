import 'package:flutter/material.dart';

class AppProgressBar extends StatelessWidget {
  final double progress; // 0 - 100
  final String? label;

  const AppProgressBar({
    super.key,
    required this.progress,
    this.label,
  });

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF4C6FBC); // --button-primary
    final backgroundColor = const Color(0xFFCBD5E0); // --border

    return Semantics(
      label: label ?? "Progress",
      value: "$progress percent",
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label != null) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  label!,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF1A2332),
                  ),
                ),
                Text(
                  "${progress.toInt()}% Complete",
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF1A2332),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
          ],

          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: Container(
              height: 8,
              color: backgroundColor,
              child: TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: progress / 100),
                duration: const Duration(milliseconds: 300),
                builder: (context, value, _) {
                  return FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: value,
                    child: Container(
                      color: primaryColor,
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
