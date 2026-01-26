import 'package:flutter/material.dart';

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isPrimary;
  final bool isDisabled;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isPrimary = true,
    this.isDisabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final backgroundColor = isPrimary
        ? const Color(0xFF4C6FBC) // --button-primary
        : Colors.transparent;

    final borderColor = const Color(0xFFCBD5E0); // --border
    final textColor = isPrimary ? Colors.white : const Color(0xFF1A2332);

    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        onPressed: isDisabled ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: textColor,
          disabledBackgroundColor: backgroundColor.withValues(alpha: 0.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: isPrimary ? BorderSide.none : BorderSide(color: borderColor, width: 2),
          ),
          elevation: 0,
        ),
        child: Text(
          text,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
