import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_card.dart';
import '../widgets/ui/app_button.dart';
import '../widgets/navigation/header_voice_button.dart';

class SchedulePage extends StatefulWidget {
  const SchedulePage({super.key});

  @override
  State<SchedulePage> createState() => _SchedulePageState();
}

class _SchedulePageState extends State<SchedulePage> {
  String selectedTab = 'today'; // 'today' | 'upcoming'
  DateTime selectedDate = DateTime.now();

  // Demo data (empty like React)
  final List<dynamic> todayAppointments = const [];
  final List<dynamic> upcomingAppointments = const [];

  int get todayCount => todayAppointments.length;
  int get upcomingCount => upcomingAppointments.length;

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(now.year - 2),
      lastDate: DateTime(now.year + 5),
    );
    if (picked != null) {
      setState(() => selectedDate = picked);
    }
  }

  void _scheduleAppointment() {
    // TODO: hook up add appointment flow
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Schedule Appointment (demo)')),
    );
  }

  void _viewCalendar() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('View Calendar (demo)')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final isToday = selectedTab == 'today';

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: cs.surface,
            surfaceTintColor: cs.surface,
            automaticallyImplyLeading: false,
            titleSpacing: 8,
            title: Row(
              children: [
                IconButton(
                  tooltip: 'Back',
                  onPressed: () => context.go('/caregiver/dashboard'),
                  icon: const Icon(Icons.arrow_back),
                ),
                const SizedBox(width: 6),
                Text(
                  'Schedule',
                  style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                ),
                const Spacer(),
                const Padding(
                  padding: EdgeInsets.only(right: 8),
                  child: HeaderVoiceButton(),
                ),
              ],
            ),
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(2),
              child: Container(height: 2, color: theme.dividerColor),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
            sliver: SliverList(
              delegate: SliverChildListDelegate(
                [
                  // Section title
                  Row(
                    children: [
                      Icon(Icons.calendar_month, color: cs.primary),
                      const SizedBox(width: 8),
                      Text("Today's Schedule",
                          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Date picker (styled like input)
                  InkWell(
                    onTap: _pickDate,
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                      decoration: BoxDecoration(
                        color: cs.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: theme.dividerColor, width: 2),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              _formatDate(selectedDate),
                              style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w700),
                            ),
                          ),
                          Icon(Icons.date_range, color: cs.primary),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Tabs
                  Row(
                    children: [
                      Expanded(
                        child: _TabButton(
                          label: 'Today ($todayCount)',
                          active: isToday,
                          onTap: () => setState(() => selectedTab = 'today'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _TabButton(
                          label: 'Upcoming ($upcomingCount)',
                          active: !isToday,
                          onTap: () => setState(() => selectedTab = 'upcoming'),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 14),

                  // Empty state (matches your React demo)
                  AppCard(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      children: [
                        const SizedBox(height: 8),
                        Icon(Icons.calendar_month, size: 64, color: theme.hintColor),
                        const SizedBox(height: 12),
                        Text(
                          isToday ? 'No appointments today' : 'No upcoming appointments',
                          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          isToday
                              ? 'You have a clear schedule for today'
                              : 'Nothing scheduled yet—add an appointment when ready',
                          style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        AppButton(
                          variant: AppButtonVariant.primary,
                          onPressed: _scheduleAppointment,
                          icon: const Icon(Icons.add, size: 20),
                          child: const Text('Schedule Appointment'),
                        ),
                        const SizedBox(height: 6),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Quick Actions
                  Text('Quick Actions',
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),

                  LayoutBuilder(
                    builder: (context, constraints) {
                      final wide = constraints.maxWidth >= 520;
                      final cross = wide ? 2 : 2; // always 2 like React
                      return GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: cross,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 1.1,
                        children: [
                          _QuickActionTile(
                            icon: Icons.calendar_month,
                            label: 'View Calendar',
                            onTap: _viewCalendar,
                          ),
                          _QuickActionTile(
                            icon: Icons.add,
                            label: 'Add Appointment',
                            onTap: _scheduleAppointment,
                          ),
                        ],
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime d) {
    // Simple yyyy-mm-dd like your HTML date input; change to localized later if you want.
    final mm = d.month.toString().padLeft(2, '0');
    final dd = d.day.toString().padLeft(2, '0');
    return '${d.year}-$mm-$dd';
  }
}

class _TabButton extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _TabButton({
    required this.label,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: active ? cs.primary : cs.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: active ? cs.primary : theme.dividerColor, width: 2),
        ),
        child: Center(
          child: Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w800,
              color: active ? Colors.white : cs.onSurface,
            ),
          ),
        ),
      ),
    );
  }
}

class _QuickActionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickActionTile({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cs.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: theme.dividerColor, width: 2),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 34, color: cs.primary),
            const SizedBox(height: 10),
            Text(label, style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w800)),
          ],
        ),
      ),
    );
  }
}
