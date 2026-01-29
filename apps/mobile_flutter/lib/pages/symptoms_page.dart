import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_card.dart';
import '../widgets/ui/app_button.dart';
import '../widgets/ui/app_textarea.dart';
import '../widgets/navigation/header_voice_button.dart';

class SymptomsPage extends StatefulWidget {
  const SymptomsPage({super.key});

  @override
  State<SymptomsPage> createState() => _SymptomsPageState();
}

class _SymptomsPageState extends State<SymptomsPage> {
  int severity = 3; // 0..4
  final _notes = TextEditingController();

  final List<_Symptom> symptoms = [
    _Symptom(id: 1, name: 'Headache', icon: '🤕'),
    _Symptom(id: 2, name: 'Fatigue', icon: '😴'),
    _Symptom(id: 3, name: 'Nausea', icon: '🤢'),
    _Symptom(id: 4, name: 'Fever', icon: '🤒'),
    _Symptom(id: 5, name: 'Pain', icon: '💢'),
    _Symptom(id: 6, name: 'Dizziness', icon: '😵'),
  ];

  final List<String> severityLabels = const ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'];

  void _toggleSymptom(int id) {
    setState(() {
      final idx = symptoms.indexWhere((s) => s.id == id);
      if (idx == -1) return;
      symptoms[idx] = symptoms[idx].copyWith(selected: !symptoms[idx].selected);
    });
  }

  void _submit() {
    // demo submit: navigate back
    context.go('/patient/dashboard');
  }

  @override
  void dispose() {
    _notes.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

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
                  'Symptoms',
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
                  // Card 1: symptom selection
                  AppCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Select your symptoms',
                            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900)),
                        const SizedBox(height: 12),

                        LayoutBuilder(
                          builder: (context, constraints) {
                            final width = constraints.maxWidth;
                            final crossAxisCount = width >= 700 ? 3 : 2;

                            return GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: symptoms.length,
                              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: crossAxisCount,
                                crossAxisSpacing: 12,
                                mainAxisSpacing: 12,
                                childAspectRatio: 1.15,
                              ),
                              itemBuilder: (context, i) {
                                final s = symptoms[i];
                                return _SymptomTile(
                                  symptom: s,
                                  onTap: () => _toggleSymptom(s.id),
                                );
                              },
                            );
                          },
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Card 2: severity slider
                  AppCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Severity Level',
                            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900)),
                        const SizedBox(height: 12),

                        Slider(
                          value: severity.toDouble(),
                          min: 0,
                          max: 4,
                          divisions: 4,
                          label: severityLabels[severity],
                          onChanged: (v) => setState(() => severity = v.round()),
                        ),

                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            for (int i = 0; i < severityLabels.length; i++)
                              Expanded(
                                child: Text(
                                  severityLabels[i],
                                  textAlign: TextAlign.center,
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: i == severity ? cs.primary : theme.hintColor,
                                    fontWeight: i == severity ? FontWeight.w900 : FontWeight.w500,
                                  ),
                                ),
                              ),
                          ],
                        ),

                        const SizedBox(height: 12),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: cs.surfaceContainerHighest,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: theme.dividerColor, width: 2),
                          ),
                          child: Center(
                            child: Text(
                              severityLabels[severity],
                              style: theme.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w900,
                                color: cs.primary,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Card 3: notes
                  AppCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Additional Notes',
                            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900)),
                        const SizedBox(height: 12),
                        AppTextarea(
                          controller: _notes,
                          hintText:
                              'Share any symptoms, medication effects, or general notes about your day',
                          minLines: 4,
                          maxLines: 10,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Submit
                  SizedBox(
                    width: double.infinity,
                    child: AppButton(
                      variant: AppButtonVariant.primary,
                      onPressed: _submit,
                      child: const Text('Submit Log'),
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

class _Symptom {
  final int id;
  final String name;
  final String icon;
  final bool selected;

  const _Symptom({
    required this.id,
    required this.name,
    required this.icon,
    this.selected = false,
  });

  _Symptom copyWith({bool? selected}) {
    return _Symptom(
      id: id,
      name: name,
      icon: icon,
      selected: selected ?? this.selected,
    );
  }
}

class _SymptomTile extends StatelessWidget {
  final _Symptom symptom;
  final VoidCallback onTap;

  const _SymptomTile({required this.symptom, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final borderColor = symptom.selected ? cs.primary : theme.dividerColor;

    return Semantics(
      button: true,
      selected: symptom.selected,
      label: '${symptom.name}${symptom.selected ? ', selected' : ''}',
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: symptom.selected ? cs.primary.withValues(alpha: 0.08) : cs.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: borderColor, width: 2),
            boxShadow: symptom.selected
                ? [
                    BoxShadow(
                      blurRadius: 0,
                      spreadRadius: 2,
                      color: cs.primary.withValues(alpha: 0.18),
                    ),
                  ]
                : null,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(symptom.icon, style: const TextStyle(fontSize: 28)),
              const SizedBox(height: 10),
              Text(
                symptom.name,
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
