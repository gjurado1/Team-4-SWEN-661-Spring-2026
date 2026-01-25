import 'package:flutter/material.dart';

class AppCheckbox extends StatelessWidget {
  final String? label;
  final bool checked;
  final ValueChanged<bool> onChanged;
  final bool disabled;

  const AppCheckbox({
    super.key,
    this.label,
    required this.checked,
    required this.onChanged,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final borderColor = const Color(0xFFCBD5E0); // --border
    final primaryColor = const Color(0xFF4C6FBC); // --button-primary

    return Semantics(
      checked: checked,
      enabled: !disabled,
      child: GestureDetector(
        onTap: disabled ? null : () => onChanged(!checked),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: checked ? primaryColor : Colors.white,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(
                  color: checked ? primaryColor : borderColor,
                  width: 2,
                ),
              ),
              child: checked
                  ? const Icon(Icons.check, color: Colors.white, size: 20)
                  : null,
            ),

            if (label != null) ...[
              const SizedBox(width: 12),
              Opacity(
                opacity: disabled ? 0.5 : 1.0,
                child: Text(
                  label!,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF1A2332), // --text-primary
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
