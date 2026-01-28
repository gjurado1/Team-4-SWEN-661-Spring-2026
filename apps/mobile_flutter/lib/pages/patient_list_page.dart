import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_badge.dart';
import '../widgets/ui/app_card.dart';
import '../widgets/ui/app_input.dart';
import '../widgets/navigation/header_voice_button.dart';

class PatientListPage extends StatefulWidget {
  const PatientListPage({super.key});

  @override
  State<PatientListPage> createState() => _PatientListPageState();
}

class _PatientListPageState extends State<PatientListPage> {
  final _search = TextEditingController();

  final _patients = const [
    _Patient(
      id: 1,
      name: 'Sarah Johnson',
      lastUpdate: 'Last Updated: 12/25/2024',
      urgent: true,
      condition: 'Severe symptoms reported',
      nextCheckIn: 'Next Check-In: 12/28/2024',
      mood: 'Poor',
      moodIcon: '😢',
    ),
    _Patient(
      id: 2,
      name: 'Robert Chen',
      lastUpdate: 'Last Updated: 12/24/2024',
      urgent: true,
      condition: 'Missed medication dose',
      nextCheckIn: 'Next Check-In: 12/28/2024',
      mood: 'Concerned',
      moodIcon: '😐',
    ),
    _Patient(
      id: 3,
      name: 'James Miller',
      lastUpdate: 'Last Updated: 12/24/2024',
      urgent: false,
      condition: 'Routine check-in',
      nextCheckIn: 'Next Check-In: 12/27/2024',
      mood: 'Good',
      moodIcon: '🙂',
    ),
    _Patient(
      id: 4,
      name: 'Mary Williams',
      lastUpdate: 'Last Updated: 12/23/2024',
      urgent: false,
      condition: 'Stable condition',
      nextCheckIn: 'Next Check-In: 12/26/2024',
      mood: 'Great',
      moodIcon: '😊',
    ),
  ];

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final q = _search.text.trim().toLowerCase();
    final filtered = q.isEmpty ? _patients : _patients.where((p) => p.name.toLowerCase().contains(q)).toList();

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: theme.colorScheme.surface,
            surfaceTintColor: theme.colorScheme.surface,
            automaticallyImplyLeading: false,
            titleSpacing: 16,
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    IconButton(
                      tooltip: 'Back',
                      onPressed: () => context.go('/caregiver/dashboard'),
                      icon: const Icon(Icons.arrow_back),
                    ),
                    const Spacer(),
                    const HeaderVoiceButton(),
                  ],
                ),
                Text('All Patients', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900)),
                const SizedBox(height: 10),
                AppInput(
                  controller: _search,
                  hintText: 'Search patients...',
                  prefix: const Icon(Icons.search, size: 22),
                  onChanged: (_) => setState(() {}),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 6),
              ],
            ),
            toolbarHeight: 160,
            bottom: PreferredSize(preferredSize: const Size.fromHeight(2), child: Container(height: 2, color: theme.dividerColor)),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, i) {
                  final p = filtered[i];
                  final leftBorderColor = p.urgent ? theme.colorScheme.error : const Color(0xFF2F855A);

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: AppCard(
                      padding: const EdgeInsets.all(14),
                      child: Container(
                        decoration: BoxDecoration(
                          border: Border(left: BorderSide(color: leftBorderColor, width: 4)),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(p.name, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900)),
                                      ),
                                      if (p.urgent) const AppBadge.error(text: 'URGENT'),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(p.lastUpdate, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                                  const SizedBox(height: 10),

                                  Text(
                                    p.condition,
                                    style: theme.textTheme.bodyMedium?.copyWith(
                                      fontWeight: FontWeight.w800,
                                      color: p.urgent ? theme.colorScheme.error : theme.colorScheme.onSurface,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(p.nextCheckIn, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Text('Mood:', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                                      const SizedBox(width: 8),
                                      Text(p.moodIcon, style: const TextStyle(fontSize: 18)),
                                      const SizedBox(width: 6),
                                      Text(p.mood, style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w800)),
                                    ],
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(width: 8),
                            Column(
                              children: [
                                IconButton(
                                  tooltip: 'Notifications',
                                  onPressed: () {},
                                  icon: Icon(Icons.notifications, color: theme.colorScheme.primary),
                                ),
                                IconButton(
                                  tooltip: 'Message patient',
                                  onPressed: () => context.go('/messages'),
                                  icon: Icon(Icons.message, color: theme.colorScheme.primary),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
                childCount: filtered.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Patient {
  final int id;
  final String name;
  final String lastUpdate;
  final bool urgent;
  final String condition;
  final String nextCheckIn;
  final String mood;
  final String moodIcon;

  const _Patient({
    required this.id,
    required this.name,
    required this.lastUpdate,
    required this.urgent,
    required this.condition,
    required this.nextCheckIn,
    required this.mood,
    required this.moodIcon,
  });
}
