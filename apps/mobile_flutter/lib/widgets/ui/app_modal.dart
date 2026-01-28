import 'package:flutter/material.dart';

enum AppModalSize { sm, md, lg }

class AppModal extends StatelessWidget {
  final bool isOpen;
  final VoidCallback onClose;
  final String? title;
  final Widget child;
  final AppModalSize size;

  const AppModal({
    super.key,
    required this.isOpen,
    required this.onClose,
    this.title,
    required this.child,
    this.size = AppModalSize.md,
  });

  double _maxWidth() => switch (size) {
        AppModalSize.sm => 448, // ~max-w-md
        AppModalSize.md => 512, // ~max-w-lg
        AppModalSize.lg => 672, // ~max-w-2xl
      };

  @override
  Widget build(BuildContext context) {
    if (!isOpen) return const SizedBox.shrink();

    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Stack(
      children: [
        Positioned.fill(
          child: GestureDetector(
            onTap: onClose,
            child: Container(color: Colors.black.withValues(alpha: 0.5)),
          ),
        ),
        Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: _maxWidth(), maxHeight: MediaQuery.of(context).size.height * 0.90),
            child: Material(
              color: cs.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: theme.dividerColor, width: 2),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (title != null)
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          border: Border(bottom: BorderSide(color: theme.dividerColor, width: 2)),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                title!,
                                style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
                              ),
                            ),
                            IconButton(
                              tooltip: 'Close modal',
                              onPressed: onClose,
                              icon: const Icon(Icons.close),
                            ),
                          ],
                        ),
                      ),
                    Flexible(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(24),
                        child: child,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
