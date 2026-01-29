import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_button.dart';
import '../widgets/ui/app_card.dart';
import '../widgets/ui/app_input.dart';
import '../widgets/ui/app_logo.dart';

enum _Step { role, personal, contact, preferences, review }
enum _Role { caregiver, patient }

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  _Step _step = _Step.role;
  _Role? _role;

  final _firstName = TextEditingController();
  final _lastName = TextEditingController();
  final _dob = TextEditingController();
  final _phone = TextEditingController();
  final _email = TextEditingController();
  final _street = TextEditingController();
  final _city = TextEditingController();
  final _state = TextEditingController();
  final _zip = TextEditingController();

  final _steps = const [_Step.role, _Step.personal, _Step.contact, _Step.preferences, _Step.review];

  int get _stepIndex => _steps.indexOf(_step);
  int get _stepCount => _steps.length;

  int get _progressPercent {
    final p = ((_stepIndex + 1) / _stepCount) * 100.0;
    return p.round().clamp(0, 100);
  }

  bool get _canGoNext {
    if (_step == _Step.role) return _role != null;
    return true;
  }

  void _next() {
    final nextIndex = _stepIndex + 1;
    if (nextIndex < _stepCount) {
      setState(() => _step = _steps[nextIndex]);
    } else {
      context.go('/login');
    }
  }

  void _back() {
    final prevIndex = _stepIndex - 1;
    if (prevIndex >= 0) {
      setState(() => _step = _steps[prevIndex]);
    } else {
      context.go('/login');
    }
  }

  @override
  void dispose() {
    _firstName.dispose();
    _lastName.dispose();
    _dob.dispose();
    _phone.dispose();
    _email.dispose();
    _street.dispose();
    _city.dispose();
    _state.dispose();
    _zip.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 28, 16, 24),
              child: Column(
                children: [
                  // Top header (logo + title)
                  const AppLogo(size: AppLogoSize.lg, showTagline: true),
                  const SizedBox(height: 12),
                  Text(
                    'Create Your CareConnect Account',
                    style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 18),

                  // Main card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: cs.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: theme.dividerColor, width: 2),
                      boxShadow: const [BoxShadow(blurRadius: 18, offset: Offset(0, 10))],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _ProgressBar(
                          percent: _progressPercent,
                          label: 'Step ${_stepIndex + 1} of $_stepCount',
                        ),
                        const SizedBox(height: 16),

                        AnimatedSwitcher(
                          duration: const Duration(milliseconds: 220),
                          child: _buildStep(context),
                        ),

                        const SizedBox(height: 18),

                        // Navigation row
                        Row(
                          children: [
                            Expanded(
                              child: AppButton(
                                variant: AppButtonVariant.secondary,
                                onPressed: _back,
                                icon: const Icon(Icons.arrow_back, size: 20),
                                child: Text(_stepIndex == 0 ? 'Back to Login' : 'Back'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: AppButton(
                                variant: AppButtonVariant.primary,
                                onPressed: _canGoNext ? _next : null,
                                icon: const Icon(Icons.arrow_forward, size: 20),
                                child: Text(_stepIndex == _stepCount - 1 ? 'Complete' : 'Next'),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 16),

                        // Demo notice
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: cs.primary.withValues(alpha: 0.10),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: cs.primary.withValues(alpha: 0.30), width: 2),
                          ),
                          child: Column(
                            children: [
                              Text('Demo Mode', style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w800)),
                              const SizedBox(height: 6),
                              Text(
                                "This is a demonstration of CareConnect's interface. No real data is stored or transmitted.",
                                style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStep(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    switch (_step) {
      case _Step.role:
        return Column(
          key: const ValueKey('role'),
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.verified_user, color: cs.primary),
                const SizedBox(width: 8),
                Text('Account Role', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
              ],
            ),
            const SizedBox(height: 10),
            Text('Who is this account for?', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            Text(
              'Choose the role that best describes your relationship to healthcare management',
              style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor),
            ),
            const SizedBox(height: 14),

            AppCard(
              padding: const EdgeInsets.all(16),
              onTap: () => setState(() => _role = _Role.caregiver),
              child: _RoleCard(
                title: '👨‍⚕️ Caregiver',
                subtitle: 'I provide care and monitor health for patients',
                selected: _role == _Role.caregiver,
              ),
            ),
            const SizedBox(height: 12),
            AppCard(
              padding: const EdgeInsets.all(16),
              onTap: () => setState(() => _role = _Role.patient),
              child: _RoleCard(
                title: '👤 Care Recipient (Patient)',
                subtitle: 'I receive care and track my own health',
                selected: _role == _Role.patient,
              ),
            ),
          ],
        );

      case _Step.personal:
        return Column(
          key: const ValueKey('personal'),
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Personal Information', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
            const SizedBox(height: 12),
            AppInput(
              label: 'First Name *',
              hintText: 'Enter first name',
              controller: _firstName,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 12),
            AppInput(
              label: 'Last Name *',
              hintText: 'Enter last name',
              controller: _lastName,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 12),
            AppInput(
              label: 'Date of Birth *',
              hintText: 'mm / dd / yyyy',
              controller: _dob,
              keyboardType: TextInputType.datetime,
            ),
          ],
        );

      case _Step.contact:
        return Column(
          key: const ValueKey('contact'),
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Contact Information', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
            const SizedBox(height: 12),
            AppInput(
              label: 'Phone Number *',
              hintText: '(555) 123-4567',
              controller: _phone,
              keyboardType: TextInputType.phone,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 12),
            AppInput(
              label: 'Email Address *',
              hintText: 'your@email.com',
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 12),
            AppInput(
              label: 'Street Address *',
              hintText: '123 Main Street',
              controller: _street,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 12),
            AppInput(
              label: 'City *',
              hintText: 'Enter city',
              controller: _city,
              textInputAction: TextInputAction.next,
            ),

            // You had state + zip in formData even if not rendered in snippet; optional fields here:
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: AppInput(
                    label: 'State',
                    hintText: 'IL',
                    controller: _state,
                    textInputAction: TextInputAction.next,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: AppInput(
                    label: 'ZIP Code',
                    hintText: '62701',
                    controller: _zip,
                    keyboardType: TextInputType.number,
                  ),
                ),
              ],
            ),
          ],
        );

      case _Step.preferences:
        return Column(
          key: const ValueKey('preferences'),
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Account Setup Complete!', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            Text(
              'You can customize your accessibility preferences after creating your account.',
              style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor),
            ),
          ],
        );

      case _Step.review:
        return Column(
          key: const ValueKey('review'),
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Review', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
            const SizedBox(height: 10),
            Text('Please confirm your information before completing registration.',
                style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor)),
            const SizedBox(height: 14),

            _ReviewRow(label: 'Role', value: _role == _Role.caregiver ? 'Caregiver' : _role == _Role.patient ? 'Care Recipient (Patient)' : '—'),
            _ReviewRow(label: 'Name', value: '${_firstName.text} ${_lastName.text}'.trim().isEmpty ? '—' : '${_firstName.text} ${_lastName.text}'.trim()),
            _ReviewRow(label: 'Date of Birth', value: _dob.text.trim().isEmpty ? '—' : _dob.text.trim()),
            _ReviewRow(label: 'Phone', value: _phone.text.trim().isEmpty ? '—' : _phone.text.trim()),
            _ReviewRow(label: 'Email', value: _email.text.trim().isEmpty ? '—' : _email.text.trim()),
            _ReviewRow(label: 'Address', value: _street.text.trim().isEmpty ? '—' : '${_street.text}, ${_city.text} ${_state.text} ${_zip.text}'.trim()),
          ],
        );
    }
  }
}

class _ProgressBar extends StatelessWidget {
  final int percent;
  final String label;

  const _ProgressBar({required this.percent, required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(child: Text(label, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor))),
            Text('$percent%', style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w800)),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: LinearProgressIndicator(
            value: percent / 100.0,
            minHeight: 10,
            backgroundColor: cs.surfaceContainerHighest,
            color: cs.primary,
          ),
        ),
      ],
    );
  }
}

class _RoleCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool selected;

  const _RoleCard({
    required this.title,
    required this.subtitle,
    required this.selected,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: selected ? cs.primary : theme.dividerColor,
          width: selected ? 3 : 2,
        ),
        boxShadow: selected ? const [BoxShadow(blurRadius: 10, offset: Offset(0, 6))] : null,
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900)),
            const SizedBox(height: 6),
            Text(subtitle, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
          ],
        ),
      ),
    );
  }
}

class _ReviewRow extends StatelessWidget {
  final String label;
  final String value;

  const _ReviewRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(label, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
          ),
          Expanded(
            child: Text(value, style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}
