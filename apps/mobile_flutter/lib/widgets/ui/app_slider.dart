import 'package:flutter/material.dart';

enum AppSliderMode { single, range }

class AppSlider extends StatelessWidget {
  final AppSliderMode mode;

  // single
  final double? value;
  final ValueChanged<double>? onChanged;

  // range
  final RangeValues? range;
  final ValueChanged<RangeValues>? onRangeChanged;

  final double min;
  final double max;
  final bool disabled;

  const AppSlider.single({
    super.key,
    required double this.value,
    required this.onChanged,
    this.min = 0,
    this.max = 100,
    this.disabled = false,
  })  : mode = AppSliderMode.single,
        range = null,
        onRangeChanged = null;

  const AppSlider.range({
    super.key,
    required RangeValues this.range,
    required this.onRangeChanged,
    this.min = 0,
    this.max = 100,
    this.disabled = false,
  })  : mode = AppSliderMode.range,
        value = null,
        onChanged = null;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final sliderTheme = SliderTheme.of(context).copyWith(
      trackHeight: 16,
      activeTrackColor: cs.primary,
      inactiveTrackColor: cs.surfaceContainerHighest,
      thumbColor: cs.surface,
      overlayColor: cs.primary.withValues(alpha: 0.18),
      thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 8),
      rangeThumbShape: const RoundRangeSliderThumbShape(enabledThumbRadius: 8),
    );

    return Opacity(
      opacity: disabled ? 0.5 : 1,
      child: SliderTheme(
        data: sliderTheme,
        child: mode == AppSliderMode.single
            ? Slider(
                min: min,
                max: max,
                value: (value ?? min).clamp(min, max),
                onChanged: disabled ? null : onChanged,
              )
            : RangeSlider(
                min: min,
                max: max,
                values: range ?? RangeValues(min, max),
                onChanged: disabled ? null : onRangeChanged,
              ),
      ),
    );
  }
}
