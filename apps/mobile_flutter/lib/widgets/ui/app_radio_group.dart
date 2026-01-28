import 'package:flutter/material.dart';
import 'app_radio.dart';

class AppRadioOption<T> {
  final T value;
  final String label;

  const AppRadioOption({required this.value, required this.label});
}

class AppRadioGroup<T> extends StatelessWidget {
  final String name;
  final T? value;
  final ValueChanged<T> onChanged;
  final List<AppRadioOption<T>> options;
  final bool disabled;

  const AppRadioGroup({
    super.key,
    required this.name,
    required this.value,
    required this.onChanged,
    required this.options,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final opt in options)
          Align(
            alignment: Alignment.centerLeft,
            child: AppRadio(
              name: name,
              label: opt.label,
              checked: value == opt.value,
              disabled: disabled,
              onChange: () => onChanged(opt.value),
            ),
          ),
      ],
    );
  }
}
