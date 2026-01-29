import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_alert.dart';
import '../widgets/ui/app_button.dart';
import '../widgets/ui/app_input.dart';
import '../widgets/ui/app_logo.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _email = TextEditingController();
  bool _showModal = false;
  bool _sent = false;
  Timer? _t;

  @override
  void dispose() {
    _t?.cancel();
    _email.dispose();
    super.dispose();
  }

  void _submit() {
    final email = _email.text.trim();
    if (email.isEmpty) return;

    setState(() => _sent = true);

    _t?.cancel();
    _t = Timer(const Duration(seconds: 2), () {
      if (!mounted) return;
      setState(() {
        _showModal = false;
        _sent = false;
      });
      context.go('/login');
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 36, 20, 24),
              child: Column(
                children: [
                  const Opacity(opacity: 0.50, child: AppLogo(size: AppLogoSize.lg)),
                  const SizedBox(height: 16),

                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: theme.dividerColor, width: 2),
                      boxShadow: const [BoxShadow(blurRadius: 18, offset: Offset(0, 10))],
                    ),
                    child: Column(
                      children: [
                        Text('Reset your password', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
                        const SizedBox(height: 6),
                        Text("Enter your email address and we'll send you a link to reset your password.",
                            textAlign: TextAlign.center,
                            style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor)),
                        const SizedBox(height: 16),

                        AppButton(
                          variant: AppButtonVariant.secondary,
                          expand: true,
                          onPressed: () => setState(() => _showModal = true),
                          child: const Text('Reset Password'),
                        ),

                        const SizedBox(height: 16),
                        AppButton(
                          variant: AppButtonVariant.secondary,
                          onPressed: () => context.go('/login'),
                          icon: const Icon(Icons.arrow_back, size: 20),
                          child: const Text('Back to Login'),
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

      // Modal replacement
      bottomSheet: _showModal
          ? _ModalSheet(
              title: 'Reset your password',
              onClose: () => _sent ? null : setState(() => _showModal = false),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Enter your email address and we'll send you a link to reset your password.",
                    style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor),
                  ),
                  const SizedBox(height: 16),

                  AppInput(
                    label: 'Email address',
                    hintText: 'Enter your email address',
                    keyboardType: TextInputType.emailAddress,
                    controller: _email,
                  ),
                  const SizedBox(height: 12),

                  if (_sent) ...[
                    const AppAlert.info(child: Text('Reset link sent! Check your email for instructions.')),
                    const SizedBox(height: 12),
                  ],

                  Row(
                    children: [
                      Expanded(
                        child: AppButton(
                          variant: AppButtonVariant.secondary,
                          onPressed: _sent ? null : () => setState(() => _showModal = false),
                          child: const Text('Cancel'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: AppButton(
                          variant: AppButtonVariant.primary,
                          onPressed: (_email.text.trim().isEmpty || _sent) ? null : _submit,
                          icon: const Icon(Icons.send, size: 20),
                          child: const Text('Send Reset Link'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            )
          : null,
    );
  }
}

class _ModalSheet extends StatelessWidget {
  final String title;
  final VoidCallback? onClose;
  final Widget child;

  const _ModalSheet({required this.title, required this.onClose, required this.child});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;
    final bottomPad = MediaQuery.of(context).padding.bottom;

    return Material(
      color: Colors.black.withValues(alpha: 0.35),
      child: SafeArea(
        top: false,
        child: Align(
          alignment: Alignment.bottomCenter,
          child: Container(
            padding: EdgeInsets.fromLTRB(16, 12, 16, bottomPad + 16),
            decoration: BoxDecoration(
              color: cs.surface,
              borderRadius: const BorderRadius.only(topLeft: Radius.circular(16), topRight: Radius.circular(16)),
              border: Border(top: BorderSide(color: theme.dividerColor, width: 2)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Expanded(child: Text(title, style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800))),
                    IconButton(onPressed: onClose, icon: const Icon(Icons.close)),
                  ],
                ),
                const SizedBox(height: 8),
                child,
              ],
            ),
          ),
        ),
      ),
    );
  }
}
