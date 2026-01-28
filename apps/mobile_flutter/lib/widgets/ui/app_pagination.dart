import 'package:flutter/material.dart';
import 'app_button.dart';

class AppPagination extends StatelessWidget {
  final int page; // 1-based
  final int pageCount;
  final ValueChanged<int> onPageChanged;
  final int maxButtons;

  const AppPagination({
    super.key,
    required this.page,
    required this.pageCount,
    required this.onPageChanged,
    this.maxButtons = 7,
  });

  @override
  Widget build(BuildContext context) {
    final items = _buildPages(page, pageCount, maxButtons);

    return Wrap(
      alignment: WrapAlignment.center,
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: 8,
      runSpacing: 8,
      children: [
        AppButton(
          variant: AppButtonVariant.secondary,
          onPressed: page > 1 ? () => onPageChanged(page - 1) : null,
          icon: const Icon(Icons.chevron_left, size: 18),
          child: const Text('Previous'),
        ),

        for (final it in items)
          if (it == null)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 6),
              child: SizedBox(width: 24, child: Center(child: Text('…'))),
            )
          else
            AppButton(
              variant: AppButtonVariant.secondary,
              onPressed: it == page ? null : () => onPageChanged(it),
              child: Text('$it'),
            ),

        // trailing icon: put icon inside the child row
        AppButton(
          variant: AppButtonVariant.secondary,
          onPressed: page < pageCount ? () => onPageChanged(page + 1) : null,
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Next'),
              SizedBox(width: 6),
              Icon(Icons.chevron_right, size: 18),
            ],
          ),
        ),
      ],
    );
  }

  /// returns list of page numbers; null represents ellipsis
  List<int?> _buildPages(int page, int pageCount, int maxButtons) {
    if (pageCount <= maxButtons) return [for (int i = 1; i <= pageCount; i++) i];

    final List<int?> out = [];
    out.add(1);

    final left = (page - 1).clamp(2, pageCount - 1);
    final right = (page + 1).clamp(2, pageCount - 1);

    if (left > 2) out.add(null);
    for (int i = left; i <= right; i++) {
      out.add(i);
    }
    if (right < pageCount - 1) out.add(null);

    out.add(pageCount);
    return out;
  }
}
