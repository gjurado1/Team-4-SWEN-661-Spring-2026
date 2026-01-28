import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class AppInputOtp extends StatelessWidget {
  final int length;
  final TextEditingController controller;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onCompleted;
  final bool enabled;

  const AppInputOtp({
    super.key,
    this.length = 6,
    required this.controller,
    this.onChanged,
    this.onCompleted,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Opacity(
      opacity: enabled ? 1 : 0.5,
      child: PinCodeTextField(
        appContext: context,
        length: length,
        controller: controller,
        enableActiveFill: true,
        enabled: enabled,
        animationType: AnimationType.fade,
        cursorColor: theme.colorScheme.onSurface,
        keyboardType: TextInputType.number,
        onChanged: onChanged ?? (_) {},
        onCompleted: onCompleted,
        pinTheme: PinTheme(
          shape: PinCodeFieldShape.box,
          borderRadius: BorderRadius.circular(8),
          fieldHeight: 44,
          fieldWidth: 44,
          activeBorderWidth: 2,
          inactiveBorderWidth: 2,
          selectedBorderWidth: 2,
          inactiveColor: theme.dividerColor,
          activeColor: theme.colorScheme.primary,
          selectedColor: theme.colorScheme.primary,
          activeFillColor: theme.colorScheme.surface,
          selectedFillColor: theme.colorScheme.surface,
          inactiveFillColor: theme.colorScheme.surface,
        ),
      ),
    );
  }
}
