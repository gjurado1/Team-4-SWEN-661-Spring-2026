import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_card.dart';
import '../widgets/navigation/header_voice_button.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final profile = const _ProfileData(
      name: 'John Doe',
      role: 'Care Recipient',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      dateOfBirth: 'January 15, 1960',
      address: '123 Main Street, Springfield, IL 62701',
      emergencyContact: 'Jane Doe - (555) 987-6543',
    );

    final initials = profile.name
        .split(RegExp(r'\s+'))
        .where((p) => p.isNotEmpty)
        .map((p) => p.characters.first)
        .take(2)
        .join();

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
                  onPressed: () => context.pop(),
                  icon: const Icon(Icons.arrow_back),
                ),
                const SizedBox(width: 6),
                Text(
                  'Profile',
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
                  // Profile header card
                  AppCard(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        Container(
                          width: 96,
                          height: 96,
                          decoration: BoxDecoration(
                            color: cs.primary,
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            initials,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 34,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          profile.name,
                          style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          profile.role,
                          style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Personal Information
                  Text('Personal Information', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),

                  AppCard(
                    padding: EdgeInsets.zero,
                    child: Column(
                      children: [
                        _InfoRow(
                          icon: Icons.mail_outline,
                          iconColor: cs.primary,
                          label: 'Email',
                          value: profile.email,
                        ),
                        _DividerLine(color: theme.dividerColor),
                        _InfoRow(
                          icon: Icons.phone_outlined,
                          iconColor: cs.primary,
                          label: 'Phone',
                          value: profile.phone,
                        ),
                        _DividerLine(color: theme.dividerColor),
                        _InfoRow(
                          icon: Icons.calendar_today_outlined,
                          iconColor: cs.primary,
                          label: 'Date of Birth',
                          value: profile.dateOfBirth,
                        ),
                        _DividerLine(color: theme.dividerColor),
                        _InfoRow(
                          icon: Icons.location_on_outlined,
                          iconColor: cs.primary,
                          label: 'Address',
                          value: profile.address,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Emergency Contact
                  Text('Emergency Contact', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),

                  AppCard(
                    padding: const EdgeInsets.all(14),
                    child: _InfoRow(
                      icon: Icons.person_outline,
                      iconColor: cs.error,
                      label: 'Primary Emergency Contact',
                      value: profile.emergencyContact,
                      showDivider: false,
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

class _DividerLine extends StatelessWidget {
  final Color color;
  const _DividerLine({required this.color});

  @override
  Widget build(BuildContext context) => Container(height: 2, color: color);
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;
  final bool showDivider;

  const _InfoRow({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
    this.showDivider = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.all(14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 26, color: iconColor),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                const SizedBox(height: 4),
                Text(value, style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileData {
  final String name;
  final String role;
  final String email;
  final String phone;
  final String dateOfBirth;
  final String address;
  final String emergencyContact;

  const _ProfileData({
    required this.name,
    required this.role,
    required this.email,
    required this.phone,
    required this.dateOfBirth,
    required this.address,
    required this.emergencyContact,
  });
}
