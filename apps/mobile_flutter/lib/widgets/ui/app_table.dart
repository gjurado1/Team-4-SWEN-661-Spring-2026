import 'package:flutter/material.dart';

class AppTableContainer extends StatelessWidget {
  final Widget child;
  const AppTableContainer({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: child,
    );
  }
}

/// Convenience wrapper to create a styled DataTable quickly.
class AppDataTable extends StatelessWidget {
  final List<DataColumn> columns;
  final List<DataRow> rows;

  const AppDataTable({
    super.key,
    required this.columns,
    required this.rows,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return DataTable(
      headingRowHeight: 40,
      dataRowMinHeight: 44,
      dataRowMaxHeight: 56,
      dividerThickness: 1,
      headingTextStyle: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700),
      dataTextStyle: theme.textTheme.bodySmall,
      columns: columns,
      rows: rows,
    );
  }
}
