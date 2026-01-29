import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class AppChartItemConfig {
  final Widget? label;
  final Widget? icon;
  final Color? color;

  const AppChartItemConfig({this.label, this.icon, this.color});
}

typedef AppChartConfig = Map<String, AppChartItemConfig>;

class AppChartContainer extends StatelessWidget {
  final AppChartConfig config;
  final Widget child; // put your fl_chart widget here

  const AppChartContainer({
    super.key,
    required this.config,
    required this.child,
  });

  static AppChartConfig of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<_ChartScope>();
    assert(scope != null, 'AppChartContainer.of(context) called outside AppChartContainer');
    return scope!.config;
  }

  @override
  Widget build(BuildContext context) {
    return _ChartScope(
      config: config,
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: child,
      ),
    );
  }
}

class _ChartScope extends InheritedWidget {
  final AppChartConfig config;
  const _ChartScope({required this.config, required super.child});

  @override
  bool updateShouldNotify(_ChartScope oldWidget) => config != oldWidget.config;
}

/// Simple legend similar to ChartLegendContent.
class AppChartLegend extends StatelessWidget {
  final List<String> keys;
  final bool hideIcon;

  const AppChartLegend({
    super.key,
    required this.keys,
    this.hideIcon = false,
  });

  @override
  Widget build(BuildContext context) {
    final cfg = AppChartContainer.of(context);

    return Wrap(
      alignment: WrapAlignment.center,
      spacing: 16,
      runSpacing: 8,
      children: [
        for (final k in keys)
          _LegendItem(
            label: cfg[k]?.label ?? Text(k),
            icon: hideIcon ? null : cfg[k]?.icon,
            color: cfg[k]?.color,
          ),
      ],
    );
  }
}

class _LegendItem extends StatelessWidget {
  final Widget label;
  final Widget? icon;
  final Color? color;

  const _LegendItem({required this.label, this.icon, this.color});

  @override
  Widget build(BuildContext context) {
    final c = color ?? Theme.of(context).colorScheme.primary;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[
          IconTheme(data: IconThemeData(size: 14, color: Theme.of(context).hintColor), child: icon!),
          const SizedBox(width: 6),
        ] else ...[
          Container(width: 10, height: 10, decoration: BoxDecoration(color: c, borderRadius: BorderRadius.circular(2))),
          const SizedBox(width: 6),
        ],
        DefaultTextStyle.merge(style: Theme.of(context).textTheme.bodySmall, child: label),
      ],
    );
  }
}

/// A ready-to-use LineChart helper.
class AppLineChart extends StatelessWidget {
  final List<_Series> series;
  final bool showGrid;
  final bool showDots;

  const AppLineChart({
    super.key,
    required this.series,
    this.showGrid = true,
    this.showDots = false,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return LineChart(
      LineChartData(
        gridData: FlGridData(show: showGrid),
        borderData: FlBorderData(show: true),
        titlesData: const FlTitlesData(show: true),
        lineBarsData: [
          for (final s in series)
            LineChartBarData(
              spots: s.spots,
              isCurved: true,
              dotData: FlDotData(show: showDots),
              color: s.color ?? cs.primary,
              barWidth: 3,
            ),
        ],
      ),
    );
  }
}

class _Series {
  final String key;
  final List<FlSpot> spots;
  final Color? color;
  const _Series({required this.key, required this.spots, this.color});
}
