import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

enum AppCalendarSelectionMode { single, range }

class AppCalendar extends StatefulWidget {
  final DateTime firstDay;
  final DateTime lastDay;
  final DateTime focusedDay;

  final AppCalendarSelectionMode mode;

  final DateTime? selectedDay;
  final ValueChanged<DateTime?>? onSelectedDay;

  final DateTimeRange? selectedRange;
  final ValueChanged<DateTimeRange?>? onSelectedRange;

  const AppCalendar({
    super.key,
    required this.firstDay,
    required this.lastDay,
    required this.focusedDay,
    this.mode = AppCalendarSelectionMode.single,
    this.selectedDay,
    this.onSelectedDay,
    this.selectedRange,
    this.onSelectedRange,
  });

  @override
  State<AppCalendar> createState() => _AppCalendarState();
}

class _AppCalendarState extends State<AppCalendar> {
  late DateTime _focusedDay;
  DateTime? _selectedDay;
  DateTime? _rangeStart;
  DateTime? _rangeEnd;

  @override
  void initState() {
    super.initState();
    _focusedDay = widget.focusedDay;
    _selectedDay = widget.selectedDay;
    _rangeStart = widget.selectedRange?.start;
    _rangeEnd = widget.selectedRange?.end;
  }

  @override
  void didUpdateWidget(covariant AppCalendar oldWidget) {
    super.didUpdateWidget(oldWidget);
    _selectedDay = widget.selectedDay;
    _rangeStart = widget.selectedRange?.start;
    _rangeEnd = widget.selectedRange?.end;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return TableCalendar(
      firstDay: widget.firstDay,
      lastDay: widget.lastDay,
      focusedDay: _focusedDay,

      calendarFormat: CalendarFormat.month,
      startingDayOfWeek: StartingDayOfWeek.sunday,

      selectedDayPredicate: (day) => isSameDay(_selectedDay, day),

      rangeStartDay: _rangeStart,
      rangeEndDay: _rangeEnd,
      rangeSelectionMode:
          widget.mode == AppCalendarSelectionMode.range ? RangeSelectionMode.toggledOn : RangeSelectionMode.disabled,

      onDaySelected: widget.mode == AppCalendarSelectionMode.single
          ? (selected, focused) {
              setState(() {
                _selectedDay = selected;
                _focusedDay = focused;
              });
              widget.onSelectedDay?.call(selected);
            }
          : null,

      onRangeSelected: widget.mode == AppCalendarSelectionMode.range
          ? (start, end, focused) {
              setState(() {
                _rangeStart = start;
                _rangeEnd = end;
                _focusedDay = focused;
              });
              if (start != null && end != null) {
                widget.onSelectedRange?.call(DateTimeRange(start: start, end: end));
              } else {
                widget.onSelectedRange?.call(null);
              }
            }
          : null,

      headerStyle: HeaderStyle(
        titleCentered: true,
        formatButtonVisible: false,
        leftChevronIcon: Icon(Icons.chevron_left, color: cs.primary),
        rightChevronIcon: Icon(Icons.chevron_right, color: cs.primary),
        titleTextStyle: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w700) ?? const TextStyle(),
      ),

      calendarStyle: CalendarStyle(
        todayDecoration: BoxDecoration(
          border: Border.all(color: cs.primary, width: 2),
          shape: BoxShape.circle,
        ),
        selectedDecoration: BoxDecoration(
          color: cs.primary,
          shape: BoxShape.circle,
        ),
        rangeStartDecoration: BoxDecoration(
          color: cs.primary,
          shape: BoxShape.circle,
        ),
        rangeEndDecoration: BoxDecoration(
          color: cs.primary,
          shape: BoxShape.circle,
        ),
        withinRangeDecoration: BoxDecoration(
          color: cs.primary.withValues(alpha: 0.15),
          shape: BoxShape.circle,
        ),
        outsideDaysVisible: false,
      ),
    );
  }
}
