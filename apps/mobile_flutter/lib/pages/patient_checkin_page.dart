import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_button.dart';
import '../widgets/ui/app_card.dart';
import '../widgets/ui/app_textarea.dart';
import '../widgets/navigation/header_voice_button.dart';

class PatientCheckInPage extends StatefulWidget {
  const PatientCheckInPage({super.key});

  @override
  State<PatientCheckInPage> createState() => _PatientCheckInPageState();
}

class _PatientCheckInPageState extends State<PatientCheckInPage> {
  String? _selectedMood;
  final _symptoms = TextEditingController();

  final _moods = const [
    (emoji: '😢', label: 'Very Sad', value: 'very-sad'),
    (emoji: '😔', label: 'Sad', value: 'sad'),
    (emoji: '😐', label: 'Neutral', value: 'neutral'),
    (emoji: '🙂', label: 'Good', value: 'good'),
    (emoji: '😊', label: 'Great', value: 'great'),
  ];

  @override
  void dispose() {
    _symptoms.dispose();
    super.dispose();
  }

  void _submit() {
    if (_selectedMood == null) return;
    context.go('/patient/dashboard');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: theme.colorScheme.surface,
            surfaceTintColor: theme.colorScheme.surface,
            leading: IconButton(
              tooltip: 'Back',
              onPressed: () => context.go('/patient/dashboard'),
              icon: const Icon(Icons.arrow_back),
            ),
            title: const Text('Daily Check-In'),
            actions: const [Padding(padding: EdgeInsets.only(right: 8), child: HeaderVoiceButton())],
            bottom: PreferredSize(preferredSize: const Size.fromHeight(2), child: Container(height: 2, color: theme.dividerColor)),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
            sliver: SliverList(
              delegate: SliverChildListDelegate(
                [
                  AppCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Text('Share how you\'re feeling today', style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor)),
                        const SizedBox(height: 16),

                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text('How are you feeling today?',
                              style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800, color: theme.colorScheme.primary)),
                        ),
                        const SizedBox(height: 12),

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

                        const SizedBox(height: 20),

                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text('Any symptoms or notes?',
                              style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800, color: theme.colorScheme.primary)),
                        ),
                        const SizedBox(height: 10),

                        AppTextarea(
                          controller: _symptoms,
                          hintText: 'Describe any symptoms, feelings, or important notes...',
                          minLines: 4,
                          maxLines: 10,
                        ),
                        const SizedBox(height: 8),
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            'Share any symptoms, medication effects, or general notes about your day',
                            style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
                          ),
                        ),

                        const SizedBox(height: 16),

                        AppButton(
                          variant: AppButtonVariant.primary,
                          expand: true,
                          onPressed: _selectedMood == null ? null : _submit,
                          child: const Text('Submit Check-In'),
                        ),

                        if (_selectedMood == null) ...[
                          const SizedBox(height: 10),
                          Text('Please select your mood to submit your check-in',
                              style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                        ],
                      ],
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
            Text(emoji, style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 6),
            Text(label, textAlign: TextAlign.center, style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}
