import 'package:flutter/material.dart';

class AppInput extends StatefulWidget {
  final String? label;
  final String? error;
  final bool isPassword;
  final TextEditingController? controller;
  final TextInputType keyboardType;

  const AppInput({
    super.key,
    this.label,
    this.error,
    this.isPassword = false,
    this.controller,
    this.keyboardType = TextInputType.text,
  });

  @override
  State<AppInput> createState() => _AppInputState();
}

class _AppInputState extends State<AppInput> {
  bool showPassword = false;

  @override
  Widget build(BuildContext context) {
    final borderColor = widget.error != null
        ? const Color(0xFFC53030) // --status-error
        : const Color(0xFFCBD5E0); // --border

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: const TextStyle(
              fontWeight: FontWeight.w500,
              color: Color(0xFF1A2332), // --text-primary
            ),
          ),
          const SizedBox(height: 8),
        ],

        TextField(
          controller: widget.controller,
          obscureText: widget.isPassword && !showPassword,
          keyboardType: widget.keyboardType,
          decoration: InputDecoration(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            filled: true,
            fillColor: Colors.white, // --bg-surface
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: borderColor, width: 2),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Color(0xFF4C6FBC), width: 2), // --button-primary
            ),
            suffixIcon: widget.isPassword
                ? IconButton(
                    icon: Icon(
                      showPassword ? Icons.visibility_off : Icons.visibility,
                      color: const Color(0xFF4A5568), // --text-secondary
                    ),
                    onPressed: () {
                      setState(() {
                        showPassword = !showPassword;
                      });
                    },
                  )
                : null,
          ),
        ),

        if (widget.error != null) ...[
          const SizedBox(height: 6),
          Text(
            widget.error!,
            style: const TextStyle(
              color: Color(0xFFC53030),
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ],
    );
  }
}
