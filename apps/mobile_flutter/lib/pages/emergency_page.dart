import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_card.dart';
import '../widgets/ui/app_button.dart';
import '../widgets/navigation/header_voice_button.dart';

class EmergencyPage extends StatefulWidget {
  const EmergencyPage({super.key});

  @override
  State<EmergencyPage> createState() => _EmergencyPageState();
}

class _EmergencyPageState extends State<EmergencyPage> {
  bool _emergencyActivated = false;

  final _contacts = const [
    _EmergencyContact(name: 'Emergency Services (911)', number: '911', type: 'Emergency'),
    _EmergencyContact(name: 'Primary Caregiver - Jane Doe', number: '(555) 987-6543', type: 'Caregiver'),
    _EmergencyContact(name: 'Dr. Sarah Miller', number: '(555) 234-5678', type: 'Doctor'),
    _EmergencyContact(name: 'Family Member - Robert Doe', number: '(555) 456-7890', type: 'Family'),
  ];

  void _handleSOS() {
    if (_emergencyActivated) return;

    showDialog<void>(
      context: context,
      barrierDismissible: true,
      builder: (_) => _ConfirmEmergencyDialog(
        onCancel: () => Navigator.of(context).pop(),
        onConfirm: () {
          Navigator.of(context).pop();
          _confirmSOS();
        },
      ),
    );
  }

  void _confirmSOS() {
    setState(() => _emergencyActivated = true);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Emergency activated. Contacts notified (demo).')),
    );
  }

  void _callContact(_EmergencyContact c) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Dial ${c.number} (demo)')),
    );
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
            backgroundColor: cs.error,
            surfaceTintColor: cs.error,
            automaticallyImplyLeading: false,
            titleSpacing: 8,
            title: Row(
              children: [
                IconButton(
                  tooltip: 'Back',
                  onPressed: () {
                    // avoid "There is nothing to pop"
                    if (context.canPop()) {
                      context.pop();
                    } else {
                      context.go('/login');
                    }
                  },
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                ),
                const SizedBox(width: 6),
                const Icon(Icons.warning_amber_rounded, color: Colors.white, size: 28),
                const SizedBox(width: 8),
                const Text(
                  'Emergency',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900),
                ),
                const Spacer(),
                const Padding(
                  padding: EdgeInsets.only(right: 8),
                  child: HeaderVoiceButton(variant: HeaderVoiceVariant.inverted),
                ),
              ],
            ),
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(2),
              child: Container(height: 2, color: cs.error),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
            sliver: SliverList(
              delegate: SliverChildListDelegate(
                [
                  if (_emergencyActivated) ...[
                    AppCard(
                      padding: const EdgeInsets.all(16),
                      child: Container(
                        decoration: BoxDecoration(
                          color: cs.error.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: cs.error.withValues(alpha: 0.45), width: 4),
                        ),
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          children: [
                            Icon(Icons.warning_amber_rounded, size: 48, color: cs.error),
                            const SizedBox(height: 10),
                            Text(
                              'Emergency Activated',
                              style: theme.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w900,
                                color: cs.error,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Your emergency contacts have been notified. Help is on the way.',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                                color: cs.error,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // SOS Card
                  AppCard(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      children: [
                        Text(
                          'Need Immediate Help?',
                          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Press the SOS button to alert your emergency contacts and caregivers',
                          style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 18),
                        SizedBox(
                          width: 260,
                          height: 260,
                          child: ElevatedButton(
                            onPressed: _emergencyActivated ? null : _handleSOS,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: cs.error,
                              foregroundColor: Colors.white,
                              shape: const CircleBorder(),
                              elevation: 12,
                              side: const BorderSide(color: Colors.white, width: 8),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.warning_amber_rounded, size: 64),
                                const SizedBox(height: 10),
                                const Text('SOS', style: TextStyle(fontSize: 34, fontWeight: FontWeight.w900)),
                                const SizedBox(height: 8),
                                Text(
                                  'Press for Emergency',
                                  style: TextStyle(fontSize: 16, color: Colors.white.withValues(alpha: 0.92)),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Location services
                  AppCard(
                    padding: const EdgeInsets.all(14),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.location_on, color: cs.primary, size: 26),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Location Services', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                              const SizedBox(height: 6),
                              Text(
                                '📍 Your location will be shared with emergency contacts when SOS is activated',
                                style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                '✓ Location: 123 Main Street, Springfield, IL 62701',
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: const Color(0xFF2F855A),
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Emergency contacts list
                  Text('Emergency Contacts', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),

                  for (final c in _contacts) ...[
                    AppCard(
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: cs.primary,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              c.type == 'Emergency' ? Icons.warning_amber_rounded : Icons.person,
                              color: Colors.white,
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(c.name, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w900)),
                                const SizedBox(height: 2),
                                Text(c.type, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                                const SizedBox(height: 6),
                                Text(
                                  c.number,
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: cs.primary,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            tooltip: 'Call ${c.name}',
                            onPressed: () => _callContact(c),
                            icon: const Icon(Icons.phone),
                            style: IconButton.styleFrom(
                              backgroundColor: const Color(0xFF2F855A),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.all(14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],

                  const SizedBox(height: 8),

                  // Safety info
                  AppCard(
                    padding: const EdgeInsets.all(16),
                    child: Container(
                      decoration: BoxDecoration(
                        color: cs.primary.withValues(alpha: 0.10),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: cs.primary.withValues(alpha: 0.30)),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Safety Information', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900)),
                          const SizedBox(height: 10),
                          Text('• Pressing SOS will immediately notify all emergency contacts', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                          const SizedBox(height: 6),
                          Text('• Your location will be shared automatically', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                          const SizedBox(height: 6),
                          Text('• Emergency services can be contacted directly from this screen', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                          const SizedBox(height: 6),
                          Text('• Your caregiver will receive a priority alert', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                        ],
                      ),
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

class _EmergencyContact {
  final String name;
  final String number;
  final String type;

  const _EmergencyContact({
    required this.name,
    required this.number,
    required this.type,
  });
}

class _ConfirmEmergencyDialog extends StatelessWidget {
  final VoidCallback onCancel;
  final VoidCallback onConfirm;

  const _ConfirmEmergencyDialog({
    required this.onCancel,
    required this.onConfirm,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Dialog(
      backgroundColor: cs.surface,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 560),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header (title + close)
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Activate Emergency SOS?',
                      style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                    ),
                  ),
                  InkWell(
                    onTap: onCancel,
                    borderRadius: BorderRadius.circular(10),
                    child: const Padding(
                      padding: EdgeInsets.all(6),
                      child: Icon(Icons.close, size: 22),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Body scrolls if needed (prevents overflow)
              Flexible(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: cs.error.withValues(alpha: 0.10),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: cs.error.withValues(alpha: 0.70), width: 2),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(Icons.warning_amber_rounded, color: cs.error, size: 28),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                'This will immediately alert all your emergency contacts and caregivers.',
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  fontWeight: FontWeight.w700,
                                  color: cs.error,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),

                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'The following actions will be taken:',
                          style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor),
                        ),
                      ),
                      const SizedBox(height: 10),

                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          '✓ Notify all emergency contacts via SMS and phone call\n'
                          '✓ Share your current location\n'
                          '✓ Alert your primary caregiver\n'
                          '✓ Log emergency event in your health records',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.hintColor,
                            height: 1.7,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Buttons (never overflow)
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      variant: AppButtonVariant.secondary,
                      onPressed: onCancel,
                      expand: true,
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppButton(
                      variant: AppButtonVariant.destructive,
                      onPressed: onConfirm,
                      expand: true,
                      child: const Text('Confirm Emergency'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
