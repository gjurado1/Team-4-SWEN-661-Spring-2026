import 'package:flutter/material.dart';
import 'app_button.dart';

class AppAlertDialog {
  static Future<bool?> show(
    BuildContext context, {
    required String title,
    required String description,
    String cancelText = 'Cancel',
    String actionText = 'Continue',
    AppButtonVariant actionVariant = AppButtonVariant.primary,
    VoidCallback? onAction, // optional side-effect
  }) {
    return showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return AlertDialog(
          title: Text(title),
          content: Text(description),
          actions: [
            AppButton(
              variant: AppButtonVariant.secondary,
              onPressed: () => Navigator.of(ctx).pop(false),
              child: Text(cancelText),
            ),
            AppButton(
              variant: actionVariant,
              onPressed: () {
                onAction?.call();
                Navigator.of(ctx).pop(true);
              },
              child: Text(actionText),
            ),
          ],
        );
      },
    );
  }
}
