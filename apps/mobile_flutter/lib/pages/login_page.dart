import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../widgets/ui/app_alert.dart';
import '../widgets/ui/app_button.dart';
import '../widgets/ui/app_input.dart';
import '../widgets/ui/app_logo.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _username = TextEditingController();
  final _password = TextEditingController();
  String _error = '';
  bool _showResetConfirm = false;
  bool _pwObscure = true;

  Future<void> _setRole(String? role) async {
    final prefs = await SharedPreferences.getInstance();
    if (role == null) {
      await prefs.remove('careconnect-role');
    } else {
      await prefs.setString('careconnect-role', role);
    }
  }

  Future<void> _handleLogin() async {
    setState(() {
      _error = '';
      _showResetConfirm = false;
    });

    final u = _username.text.trim();
    final p = _password.text.trim();

    if (u.isEmpty || p.isEmpty) {
      setState(() => _error = 'Please enter both username and password.');
      return;
    }

    // Demo login logic matches React :contentReference[oaicite:10]{index=10}
    if (u.toLowerCase().contains('caregiver') || u == 'demo') {
      await _setRole('caregiver');
      if (!mounted) return;
      context.go('/caregiver/dashboard');
    } else if (u.toLowerCase().contains('patient')) {
      await _setRole('patient');
      if (!mounted) return;
      context.go('/patient/dashboard');
    } else {
      await _setRole(null);
      setState(() => _error = 'Invalid username or password. Please try again.');
    }
  }

  Future<void> _demoLogin(String role) async {
    await _setRole(role);
    if (!mounted) return;
    context.go(role == 'caregiver' ? '/caregiver/dashboard' : '/patient/dashboard');
  }

  @override
  void dispose() {
    _username.dispose();
    _password.dispose();
    super.dispose();
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
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
              child: Column(
                children: [
                  const Opacity(
                    opacity: 1,
                    child: AppLogo(size: AppLogoSize.lg, showTagline: true),
                  ),
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
                        Text('Sign in to your account', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
                        const SizedBox(height: 6),
                        Text('Enter your credentials to access CareConnect', style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor)),
                        const SizedBox(height: 16),

                        AppInput(
                          label: 'Username',
                          hintText: 'Enter your username',
                          controller: _username,
                          textInputAction: TextInputAction.next,
                        ),
                        const SizedBox(height: 12),
                        AppInput(
                          label: 'Password',
                          hintText: 'Enter your password',
                          controller: _password,
                          obscureText: _pwObscure,
                          suffix: IconButton(
                            onPressed: () => setState(() => _pwObscure = !_pwObscure),
                            icon: Icon(_pwObscure ? Icons.visibility : Icons.visibility_off),
                          ),
                          onSubmitted: (_) => _handleLogin(),
                        ),

                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: () => context.go('/forgot-password'),
                            child: const Text('Forgot Password?'),
                          ),
                        ),

                        if (_error.isNotEmpty) ...[
                          AppAlert.error(child: Text(_error)),
                          const SizedBox(height: 12),
                        ],
                        if (_showResetConfirm) ...[
                          const AppAlert.info(child: Text('Password reset link sent! Please check your inbox.')),
                          const SizedBox(height: 12),
                        ],

                        AppButton(
                          variant: AppButtonVariant.primary,
                          expand: true,
                          onPressed: _handleLogin,
                          icon: const Icon(Icons.arrow_forward, size: 20),
                          child: const Text('Sign In'),
                        ),

                        const SizedBox(height: 12),
                        Text("Don't have an account?", style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor)),
                        const SizedBox(height: 8),
                        AppButton(
                          variant: AppButtonVariant.secondary,
                          expand: true,
                          onPressed: () => context.go('/register'),
                          child: const Text('Create Account'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Demo Mode :contentReference[oaicite:11]{index=11}
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: theme.dividerColor, width: 2),
                    ),
                    child: Column(
                      children: [
                        Text('Demo Credentials', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                        const SizedBox(height: 6),
                        Text('Use these credentials to explore CareConnect', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                        const SizedBox(height: 12),

                        _DemoTile(
                          title: '👤 Patient Account',
                          subtitle: 'Username: testpatient',
                          onTap: () => _demoLogin('patient'),
                        ),
                        const SizedBox(height: 12),
                        _DemoTile(
                          title: '👨‍⚕️ Caregiver Account',
                          subtitle: 'Username: demo',
                          onTap: () => _demoLogin('caregiver'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),
                  AppButton(
                    variant: AppButtonVariant.secondary,
                    expand: true,
                    onPressed: () => context.go('/settings'),
                    icon: const Icon(Icons.settings, size: 20),
                    child: const Text('Accessibility Settings'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _DemoTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _DemoTile({required this.title, required this.subtitle, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: theme.colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: theme.dividerColor, width: 2),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Text(subtitle, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
          ],
        ),
      ),
    );
  }
}
