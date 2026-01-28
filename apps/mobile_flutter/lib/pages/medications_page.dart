import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_card.dart';
import '../widgets/ui/app_button.dart';
import '../widgets/navigation/header_voice_button.dart';

class MedicationsPage extends StatefulWidget {
  const MedicationsPage({super.key});

  @override
  State<MedicationsPage> createState() => _MedicationsPageState();
}

class _MedicationsPageState extends State<MedicationsPage> {
  late final List<_Medication> _meds;

  @override
  void initState() {
    super.initState();
    _meds = [
      _Medication(id: 1, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: true),
      _Medication(id: 2, name: 'Metformin', dosage: '500mg', time: '12:00 PM', taken: false),
      _Medication(id: 3, name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', taken: false),
    ];
  }

  void _markTaken(int id) {
    setState(() {
      final i = _meds.indexWhere((m) => m.id == id);
      if (i != -1) _meds[i] = _meds[i].copyWith(taken: true);
    });
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
            leading: IconButton(
              tooltip: 'Back',
              onPressed: () => context.go('/patient/dashboard'),
              icon: const Icon(Icons.arrow_back),
            ),
            title: const Text('Medications'),
            actions: const [Padding(padding: EdgeInsets.only(right: 8), child: HeaderVoiceButton())],
            bottom: PreferredSize(preferredSize: const Size.fromHeight(2), child: Container(height: 2, color: theme.dividerColor)),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
            sliver: SliverList(
              delegate: SliverChildListDelegate(
                [
                  Text("Today's Schedule", style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),

                  for (final med in _meds) ...[
                    AppCard(
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: med.taken
                                  ? const Color(0xFF2F855A).withValues(alpha: 0.20)
                                  : cs.surfaceContainerHighest,
                              shape: BoxShape.circle,
                            ),
                            alignment: Alignment.center,
                            child: const Text('💊', style: TextStyle(fontSize: 22)),
                          ),
                          const SizedBox(width: 12),

                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(med.name, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w900)),
                                const SizedBox(height: 3),
                                Text(med.dosage, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    Icon(Icons.schedule, size: 16, color: theme.hintColor),
                                    const SizedBox(width: 6),
                                    Text(med.time, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                                  ],
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(width: 10),

                          if (med.taken)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: BoxDecoration(
                                color: const Color(0xFF2F855A),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Text('✓ Taken', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
                            )
                          else
                            AppButton(
                              variant: AppButtonVariant.primary,
                              onPressed: () => _markTaken(med.id),
                              child: const Text('Mark Taken'),
                            ),
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

class _Medication {
  final int id;
  final String name;
  final String dosage;
  final String time;
  final bool taken;

  const _Medication({
    required this.id,
    required this.name,
    required this.dosage,
    required this.time,
    required this.taken,
  });

  _Medication copyWith({bool? taken}) {
    return _Medication(
      id: id,
      name: name,
      dosage: dosage,
      time: time,
      taken: taken ?? this.taken,
    );
  }
}
