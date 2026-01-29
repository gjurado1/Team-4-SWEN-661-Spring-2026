import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_card.dart';
import '../widgets/navigation/header_voice_button.dart';

class ReportsPage extends StatelessWidget {
  const ReportsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final summaryStats = <_SummaryStat>[
      const _SummaryStat(label: 'Check-Ins This Week', value: '6/7', iconText: '✓', colorType: _StatColor.success),
      const _SummaryStat(label: 'Avg. Mood', value: 'Good', iconText: '🙂', colorType: _StatColor.success),
      const _SummaryStat(label: 'Symptoms Logged', value: '3', iconText: '📋', colorType: _StatColor.primary),
      const _SummaryStat(label: 'Medications On Time', value: '92%', iconText: '💊', colorType: _StatColor.success),
    ];

    final recentReports = <_WeeklyReport>[
      const _WeeklyReport(date: 'Week of Jan 15-21', summary: '6 check-ins completed, generally positive mood'),
      const _WeeklyReport(date: 'Week of Jan 8-14', summary: '7 check-ins completed, mild headache reported twice'),
      const _WeeklyReport(date: 'Week of Jan 1-7', summary: '5 check-ins completed, fatigue noted'),
    ];

    Color statColor(_StatColor t) {
      switch (t) {
        case _StatColor.success:
          return const Color(0xFF2F855A); // matches your token
        case _StatColor.primary:
          return cs.primary;
      }
    }

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
                  onPressed: () => context.go('/patient/dashboard'),
                  icon: const Icon(Icons.arrow_back),
                ),
                const SizedBox(width: 6),
                Text(
                  'Reports',
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
                  // Summary Stats
                  Text("This Week's Summary", style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),

                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: summaryStats.length,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.15,
                    ),
                    itemBuilder: (context, i) {
                      final s = summaryStats[i];
                      return AppCard(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(s.iconText, style: const TextStyle(fontSize: 24)),
                            const SizedBox(height: 10),
                            Text(
                              s.value,
                              style: theme.textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.w900,
                                color: statColor(s.colorType),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(s.label, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                          ],
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 16),

                  // Trend Indicator (info background)
                  AppCard(
                    padding: const EdgeInsets.all(16),
                    child: Container(
                      decoration: BoxDecoration(
                        color: cs.primary.withValues(alpha: 0.10),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: cs.primary.withValues(alpha: 0.30), width: 2),
                      ),
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(Icons.trending_up, size: 34, color: const Color(0xFF2F855A)),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Positive Trend',
                                  style: theme.textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.w900,
                                    color: const Color(0xFF2F855A),
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  'Your check-in consistency has improved by 15% this month',
                                  style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor, height: 1.4),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Recent Reports
                  Row(
                    children: [
                      Icon(Icons.calendar_month, color: cs.primary),
                      const SizedBox(width: 8),
                      Text('Recent Reports', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
                    ],
                  ),
                  const SizedBox(height: 12),

                  for (final r in recentReports) ...[
                    AppCard(
                      padding: const EdgeInsets.all(14),
                      onTap: () {
                        // demo: no-op. You can navigate to a detail page.
                      },
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(r.date, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w900)),
                          const SizedBox(height: 8),
                          Text(r.summary, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

enum _StatColor { success, primary }

class _SummaryStat {
  final String label;
  final String value;
  final String iconText;
  final _StatColor colorType;

  const _SummaryStat({
    required this.label,
    required this.value,
    required this.iconText,
    required this.colorType,
  });
}

class _WeeklyReport {
  final String date;
  final String summary;

  const _WeeklyReport({required this.date, required this.summary});
}
