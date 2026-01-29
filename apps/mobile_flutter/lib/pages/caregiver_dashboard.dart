import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_alert.dart';
import '../widgets/ui/app_badge.dart';
import '../widgets/ui/app_card.dart';
import '../widgets/navigation/header_voice_button.dart';

class CaregiverDashboard extends StatelessWidget {
  const CaregiverDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final upcomingCheckIns = [
      (patient: 'Sarah Johnson', time: '10:00 AM', urgent: true),
      (patient: 'Robert Chen', time: '2:00 PM', urgent: false),
      (patient: 'James Miller', time: '4:30 PM', urgent: false),
      (patient: 'Emily Davis', time: '5:15 PM', urgent: false),
      (patient: 'Michael Brown', time: '6:00 PM', urgent: true),
      (patient: 'Patricia Wilson', time: '7:30 PM', urgent: false),
      (patient: 'David Martinez', time: '8:00 PM', urgent: false),
    ];

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            automaticallyImplyLeading: false,
            backgroundColor: theme.colorScheme.surface,
            surfaceTintColor: theme.colorScheme.surface,
            titleSpacing: 16,
            title: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(color: theme.colorScheme.primary, shape: BoxShape.circle),
                  alignment: Alignment.center,
                  child: const Text('DC', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Welcome back', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                      Text('Timezone: EDT', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                    ],
                  ),
                ),
                const HeaderVoiceButton(),
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
                  // Alerts :contentReference[oaicite:14]{index=14}
                  const AppAlert.info(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.wifi_off, size: 20),
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Offline Mode', style: TextStyle(fontWeight: FontWeight.w800)),
                              SizedBox(height: 4),
                              Text('Last synced 2 hours ago. Your data will sync when reconnected.'),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  const AppAlert.error(child: Text('Important:\n3 patients have missed their scheduled check-ins today.')),
                  const SizedBox(height: 10),
                  const AppAlert.warning(child: Text('Reminder:\nSarah Johnson reported severe symptoms. Follow up required.')),

                  const SizedBox(height: 16),

                  // Summary cards
                  Row(
                    children: [
                      Expanded(
                        child: AppCard(
                          padding: const EdgeInsets.all(16),
                          child: _SummaryCard(
                            icon: Icons.people_alt,
                            iconColor: theme.colorScheme.primary,
                            label: '# of Missed Check-Ins',
                            value: '24',
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: AppCard(
                          padding: const EdgeInsets.all(16),
                          child: _SummaryCard(
                            icon: Icons.favorite,
                            iconColor: const Color(0xFF2F855A),
                            label: 'Active Patients',
                            value: '32',
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Quick actions
                  Row(
                    children: [
                      Expanded(
                        child: _QuickAction(
                          label: 'Schedule',
                          icon: Icons.schedule,
                          onTap: () => context.go('/caregiver/schedule'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _QuickAction(
                          label: 'All Patients',
                          icon: Icons.people,
                          onTap: () => context.go('/caregiver/patients'),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Upcoming check-ins list
                  Row(
                    children: [
                      Icon(Icons.schedule, color: theme.colorScheme.primary),
                      const SizedBox(width: 8),
                      Text('Upcoming Check-Ins', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
                    ],
                  ),
                  const SizedBox(height: 12),

                  Container(
                    constraints: const BoxConstraints(maxHeight: 450),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: theme.dividerColor, width: 2),
                    ),
                    child: ListView.separated(
                      itemCount: upcomingCheckIns.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, i) {
                        final c = upcomingCheckIns[i];
                        return AppCard(
                          onTap: () => context.go('/caregiver/patients'),
                          padding: const EdgeInsets.all(12),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(c.patient, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                                        ),
                                        if (c.urgent) const AppBadge.error(text: 'URGENT'),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text('Scheduled: ${c.time}', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 10),
                              IconButton(
                                tooltip: 'View details',
                                onPressed: () => context.go('/caregiver/patients'),
                                icon: Icon(Icons.insights, color: theme.colorScheme.primary),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;

  const _SummaryCard({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 28, color: iconColor),
            const SizedBox(width: 10),
            Expanded(child: Text(label, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor))),
          ],
        ),
        const SizedBox(height: 10),
        Text(value, style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
      ],
    );
  }
}

class _QuickAction extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _QuickAction({required this.label, required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: theme.dividerColor, width: 2),
        ),
        child: Column(
          children: [
            Icon(icon, color: theme.colorScheme.primary, size: 26),
            const SizedBox(height: 8),
            Text(label, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800)),
          ],
        ),
      ),
    );
  }
}
