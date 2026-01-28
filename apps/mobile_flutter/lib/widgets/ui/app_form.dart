import 'package:flutter/material.dart';
import 'app_label.dart';

class AppForm extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final AutovalidateMode autovalidateMode;
  final Widget child;

  const AppForm({
    super.key,
    required this.formKey,
    this.autovalidateMode = AutovalidateMode.onUserInteraction,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      autovalidateMode: autovalidateMode,
      child: child,
    );
  }
}

class AppFormField extends StatelessWidget {
  final String? label;
  final String? description;
  final String? errorText; // optional external error (server)
  final Widget child;

  const AppFormField({
    super.key,
    this.label,
    this.description,
    this.errorText,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label != null) ...[
            AppLabel(text: label!),
            const SizedBox(height: 8),
          ],
          child,
          if (description != null) ...[
            const SizedBox(height: 8),
            Text(
              description!,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.75),
              ),
            ),
          ],
          if (errorText != null) ...[
            const SizedBox(height: 8),
            Text(
              errorText!,
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
