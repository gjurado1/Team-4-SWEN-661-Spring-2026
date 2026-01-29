import 'package:flutter/material.dart';

class AppDialog {
  static Future<T?> show<T>(
    BuildContext context, {
    required Widget content,
    bool barrierDismissible = true,
  }) {
    return showDialog<T>(
      context: context,
      barrierDismissible: barrierDismissible,
      builder: (ctx) => Dialog(
        insetPadding: const EdgeInsets.all(16),
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.all(24),
              child: content,
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                tooltip: 'Close',
                onPressed: () => Navigator.of(ctx).maybePop(),
                icon: const Icon(Icons.close),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AppDialogHeader extends StatelessWidget {
  final Widget child;
  const AppDialogHeader({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return DefaultTextStyle.merge(
      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [child]),
    );
  }
}

class AppDialogTitle extends StatelessWidget {
  final String text;
  const AppDialogTitle(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Text(text, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700));
  }
}

class AppDialogDescription extends StatelessWidget {
  final String text;
  const AppDialogDescription(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Text(text, style: Theme.of(context).textTheme.bodyMedium);
  }
}

class AppDialogFooter extends StatelessWidget {
  final List<Widget> actions;
  const AppDialogFooter({super.key, required this.actions});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      alignment: WrapAlignment.end,
      spacing: 12,
      runSpacing: 12,
      children: actions,
    );
  }
}
