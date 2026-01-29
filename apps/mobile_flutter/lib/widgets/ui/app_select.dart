import 'package:flutter/material.dart';
import 'app_label.dart';

class AppSelectOption {
  final String value;
  final String label;
  const AppSelectOption({required this.value, required this.label});
}

class AppSelect extends StatelessWidget {
  final String? label;
  final String value; // empty string means no selection
  final ValueChanged<String> onChange;
  final List<AppSelectOption> options;
  final String placeholder;
  final bool disabled;
  final String? error;

  const AppSelect({
    super.key,
    this.label,
    required this.value,
    required this.onChange,
    required this.options,
    this.placeholder = 'Select an option',
    this.disabled = false,
    this.error,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final borderColor = error != null ? theme.colorScheme.error : theme.dividerColor;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label != null) ...[
            AppLabel(text: label!, disabled: disabled),
            const SizedBox(height: 8),
          ],
          InputDecorator(
            decoration: InputDecoration(
              enabled: !disabled,
              isDense: true,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: borderColor, width: 2),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: theme.colorScheme.primary, width: 2),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: theme.colorScheme.error, width: 2),
              ),
              suffixIcon: Icon(Icons.expand_more, color: theme.hintColor),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                isExpanded: true,
                value: value.isEmpty ? null : value,
                hint: Text(placeholder),
                items: options
                    .map((o) => DropdownMenuItem<String>(
                          value: o.value,
                          child: Text(o.label),
                        ))
                    .toList(),
                onChanged: disabled ? null : (v) => onChange(v ?? ''),
              ),
            ),
          ),
          if (error != null) ...[
            const SizedBox(height: 8),
            Text(
              error!,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.error,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
