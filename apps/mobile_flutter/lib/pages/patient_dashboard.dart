import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_alert.dart';
import '../widgets/ui/app_button.dart';
import '../widgets/ui/app_card.dart';
import '../widgets/navigation/header_voice_button.dart';

class PatientDashboard extends StatefulWidget {
  const PatientDashboard({super.key});

  @override
  State<PatientDashboard> createState() => _PatientDashboardState();
}

class _PatientDashboardState extends State<PatientDashboard> {
  String? _selectedMood;

  final _moods = const [
    (emoji: '😢', label: 'Very Sad', value: 'very-sad'),
    (emoji: '😔', label: 'Sad', value: 'sad'),
    (emoji: '😐', label: 'Neutral', value: 'neutral'),
    (emoji: '🙂', label: 'Good', value: 'good'),
    (emoji: '😊', label: 'Great', value: 'great'),
  ];

  final _recent = const [
    (date: 'Today, 9:00 AM', mood: 'Good', symptoms: 'Mild headache'),
    (date: 'Yesterday, 8:30 AM', mood: 'Great', symptoms: 'None reported'),
    (date: 'Jan 21, 8:00 AM', mood: 'Neutral', symptoms: 'Fatigue'),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

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
                  child: const Text('SJ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Hello, Sarah', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                      Text('How are you feeling today?', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                    ],
                  ),
                ),
                const HeaderVoiceButton(),
              ],
            ),
            bottom: PreferredSize(preferredSize: const Size.fromHeight(2), child: Container(height: 2, color: theme.dividerColor)),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
            sliver: SliverList(
              delegate: SliverChildListDelegate(
                [
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
                  const SizedBox(height: 16),

                  AppCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.favorite, color: theme.colorScheme.primary, size: 28),
                            const SizedBox(width: 8),
                            Text('Daily Check-In', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text('Share how you\'re feeling today', style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor)),
                        const SizedBox(height: 12),

                        Text('How are you feeling today?', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800, color: theme.colorScheme.primary)),
                        const SizedBox(height: 10),

                        Row(
                          children: [
                            for (final mood in _moods) ...[
                              Expanded(
                                child: _MoodTile(
                                  emoji: mood.emoji,
                                  label: mood.label,
                                  selected: _selectedMood == mood.value,
                                  onTap: () => setState(() => _selectedMood = mood.value),
                                ),
                              ),
                              if (mood != _moods.last) const SizedBox(width: 8),
                            ],
                          ],
                        ),

                        const SizedBox(height: 14),
                        AppButton(
                          variant: AppButtonVariant.primary,
                          expand: true,
                          onPressed: () => context.go('/patient/checkin'),
                          child: const Text('Start Check-In'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  Row(
                    children: [
                      Icon(Icons.schedule, color: theme.colorScheme.primary),
                      const SizedBox(width: 8),
                      Text('Recent Check-Ins', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
                    ],
                  ),
                  const SizedBox(height: 10),

                  for (final c in _recent) ...[
                    AppCard(
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(c.date, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800)),
                                const SizedBox(height: 6),
                                Text('Mood: ${c.mood}', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                                Text(c.symptoms, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                              ],
                            ),
                          ),
                          Icon(Icons.insights, color: theme.colorScheme.primary),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                  ],

                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _QuickAction(
                          label: 'Symptoms',
                          icon: Icons.monitor_heart,
                          onTap: () => context.go('/patient/symptoms'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _QuickAction(
                          label: 'Medications',
                          icon: Icons.medication,
                          onTap: () => context.go('/patient/medications'),
                        ),
                      ),
                    ],
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

class _MoodTile extends StatelessWidget {
  final String emoji;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _MoodTile({required this.emoji, required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: selected ? cs.surfaceContainerHighest : cs.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: selected ? cs.primary : theme.dividerColor, width: 2),
        ),
        child: Column(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 22)),
            const SizedBox(height: 6),
            Text(label, textAlign: TextAlign.center, style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700)),
          ],
        ),
      ),
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
