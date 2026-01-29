import 'package:flutter/material.dart';

enum AppToggleGroupType { single, multiple }
enum AppToggleGroupVariant { defaultVariant, outline }
enum AppToggleGroupSize { sm, defaultSize, lg }

class AppToggleGroupOption<T> {
  final T value;
  final Widget child;
  const AppToggleGroupOption({required this.value, required this.child});
}

class AppToggleGroup<T> extends StatelessWidget {
  final AppToggleGroupType type;
  final AppToggleGroupVariant variant;
  final AppToggleGroupSize size;

  // single
  final T? value;
  final ValueChanged<T?>? onChanged;

  // multiple
  final Set<T>? values;
  final ValueChanged<Set<T>>? onChangedMany;

  final List<AppToggleGroupOption<T>> options;

  const AppToggleGroup.single({
    super.key,
    this.variant = AppToggleGroupVariant.defaultVariant,
    this.size = AppToggleGroupSize.defaultSize,
    required this.value,
    required this.onChanged,
    required this.options,
  })  : type = AppToggleGroupType.single,
        values = null,
        onChangedMany = null;

  const AppToggleGroup.multiple({
    super.key,
    this.variant = AppToggleGroupVariant.defaultVariant,
    this.size = AppToggleGroupSize.defaultSize,
    required this.values,
    required this.onChangedMany,
    required this.options,
  })  : type = AppToggleGroupType.multiple,
        value = null,
        onChanged = null;

  double _height() => switch (size) {
        AppToggleGroupSize.sm => 32,
        AppToggleGroupSize.defaultSize => 36,
        AppToggleGroupSize.lg => 44,
      };

  EdgeInsets _pad() => switch (size) {
        AppToggleGroupSize.sm => const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        AppToggleGroupSize.defaultSize => const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        AppToggleGroupSize.lg => const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      };

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final radius = BorderRadius.circular(10);
    final border = BorderSide(color: theme.dividerColor, width: 1);

    return Container(
      height: _height(),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        border: variant == AppToggleGroupVariant.outline ? Border.fromBorderSide(border) : null,
        color: variant == AppToggleGroupVariant.defaultVariant ? cs.surfaceContainerHighest : cs.surface,
      ),
      clipBehavior: Clip.antiAlias,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (int i = 0; i < options.length; i++) ...[
            Expanded(
              child: _ToggleGroupItem<T>(
                option: options[i],
                active: _isActive(options[i].value),
                padding: _pad(),
                variant: variant,
                isFirst: i == 0,
                isLast: i == options.length - 1,
                radius: radius,
                onTap: () => _toggle(options[i].value),
              ),
            ),
          ],
        ],
      ),
    );
  }

  bool _isActive(T v) {
    return type == AppToggleGroupType.single ? value == v : (values?.contains(v) ?? false);
  }

  void _toggle(T v) {
    if (type == AppToggleGroupType.single) {
      final next = (value == v) ? null : v;
      onChanged?.call(next);
    } else {
      final next = {...(values ?? <T>{})};
      if (next.contains(v)) {
        next.remove(v);
      } else {
        next.add(v);
      }
      onChangedMany?.call(next);
    }
  }
}

class _ToggleGroupItem<T> extends StatelessWidget {
  final AppToggleGroupOption<T> option;
  final bool active;
  final EdgeInsets padding;
  final AppToggleGroupVariant variant;
  final bool isFirst;
  final bool isLast;
  final BorderRadius radius;
  final VoidCallback onTap;

  const _ToggleGroupItem({
    required this.option,
    required this.active,
    required this.padding,
    required this.variant,
    required this.isFirst,
    required this.isLast,
    required this.radius,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    BorderRadius itemRadius;
    if (isFirst) {
      itemRadius = BorderRadius.only(topLeft: radius.topLeft, bottomLeft: radius.bottomLeft);
    } else if (isLast) {
      itemRadius = BorderRadius.only(topRight: radius.topRight, bottomRight: radius.bottomRight);
    } else {
      itemRadius = BorderRadius.zero;
    }

    return InkWell(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 140),
        padding: padding,
        decoration: BoxDecoration(
          color: active ? cs.surface : Colors.transparent,
          borderRadius: itemRadius,
          border: variant == AppToggleGroupVariant.outline && !isFirst
              ? Border(left: BorderSide(color: theme.dividerColor))
              : null,
        ),
        child: Center(
          child: DefaultTextStyle.merge(
            style: theme.textTheme.bodySmall?.copyWith(
              fontWeight: FontWeight.w700,
              color: active ? cs.onSurface : theme.hintColor,
            ),
            child: option.child,
          ),
        ),
      ),
    );
  }
}
