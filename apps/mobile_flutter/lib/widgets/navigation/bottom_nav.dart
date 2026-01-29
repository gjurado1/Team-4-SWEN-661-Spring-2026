import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppRole { caregiver, patient }

class BottomNav extends StatefulWidget {
  final String currentPath;
  final ValueChanged<String> onNavigate;

  const BottomNav({
    super.key,
    required this.currentPath,
    required this.onNavigate,
  });

  @override
  State<BottomNav> createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {
  bool _expanded = false;
  AppRole _role = AppRole.caregiver;

  String _keyFromLabel(String label) {
  // "Patient List" -> "patient_list"
  return label.toLowerCase().replaceAll(' ', '_');
}

  @override
  void initState() {
    super.initState();
    _loadRole();
  }

  Future<void> _loadRole() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString('careconnect-role');
    setState(() {
      _role = stored == 'patient' ? AppRole.patient : AppRole.caregiver;
    });
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('careconnect-role');
  }

  List<_NavItem> get _items {
    if (_role == AppRole.caregiver) {
      return [
        const _NavItem(icon: Icons.home, label: 'Home', path: '/caregiver/dashboard'),
        const _NavItem(icon: Icons.assignment, label: 'Patient List', path: '/caregiver/patients'),
        const _NavItem(icon: Icons.bar_chart, label: 'Schedule', path: '/caregiver/schedule'),
        const _NavItem(icon: Icons.message, label: 'Messages', path: '/messages'),
        const _NavItem(icon: Icons.person, label: 'Profile', path: '/profile'),
        const _NavItem(icon: Icons.settings, label: 'Settings', path: '/settings'),
        const _NavItem(icon: Icons.warning_amber, label: 'Emergency', path: '/emergency'),
        _NavItem(
          icon: Icons.logout,
          label: 'Logout',
          path: '/login',
          onTap: () async => _logout(),
        ),
      ];
    }

    return [
      const _NavItem(icon: Icons.home, label: 'Home', path: '/patient/dashboard'),
      const _NavItem(icon: Icons.favorite, label: 'Check-In', path: '/patient/checkin'),
      const _NavItem(icon: Icons.message, label: 'Messages', path: '/messages'),
      const _NavItem(icon: Icons.person, label: 'Profile', path: '/profile'),
      const _NavItem(icon: Icons.settings, label: 'Settings', path: '/settings'),
      const _NavItem(icon: Icons.warning_amber, label: 'Emergency', path: '/emergency'),
      _NavItem(
        icon: Icons.logout,
        label: 'Logout',
        path: '/login',
        onTap: () async => _logout(),
      ),
    ];
  }

  void _navigate(_NavItem item) async {
    if (item.onTap != null) await item.onTap!.call();
    widget.onNavigate(item.path);
    setState(() => _expanded = false);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    // Reserve bottom safe area like your CSS #root padding-bottom
    final bottomPad = MediaQuery.of(context).padding.bottom;

    return Stack(
      children: [
        // Expanded full screen menu
        if (_expanded)
          Positioned.fill(
            child: Material(
              color: cs.surface,
              child: SafeArea(
                child: Column(
                  children: [
                    // Collapse header button (like your Collapse Menu button)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: cs.surface,
                        border: Border(bottom: BorderSide(color: theme.dividerColor, width: 2)),
                      ),
                      child: SizedBox(
                        height: 64,
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: () => setState(() => _expanded = false),
                          icon: const Icon(Icons.expand_more, size: 28),
                          label: const Text(
                            'Collapse Menu',
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
                          ),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: theme.dividerColor, width: 2),
                          ),
                        ),
                      ),
                    ),

                    // Grid content
                    Expanded(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(16),
                        child: GridView.count(
                          crossAxisCount: 2,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          mainAxisSpacing: 16,
                          crossAxisSpacing: 16,
                          childAspectRatio: 1.0,
                          children: [
                            for (final item in _items)
                              _NavGridTile(
                                item: item,
                                active: widget.currentPath == item.path,
                                onTap: () => _navigate(item),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

        // Bottom bar (Menu button)
        Align(
          alignment: Alignment.bottomCenter,
          child: Material(
            elevation: 8,
            color: cs.surface,
            child: Container(
              padding: EdgeInsets.only(bottom: bottomPad),
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: theme.dividerColor, width: 2)),
              ),
              child: SizedBox(
                height: 64,
                width: double.infinity,
                child: InkWell(
                  onTap: () => setState(() => _expanded = true),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.menu, size: 32),
                      const SizedBox(width: 12),
                      Text(
                        'Menu',
                        style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _NavItem {
  final IconData icon;
  final String label;
  final String path;
  final Future<void> Function()? onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.path,
    this.onTap,
  });
}

class _NavGridTile extends StatelessWidget {
  final _NavItem item;
  final bool active;
  final VoidCallback onTap;

  const _NavGridTile({
    required this.item,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Semantics(
      button: true,
      selected: active,
      label: item.label,
      child: InkWell(
        key: ValueKey('nav_${item.label.toLowerCase().replaceAll(' ', '_')}'),
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: active ? cs.primary : cs.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: active ? cs.primary : theme.dividerColor, width: 2),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: active ? Colors.white.withValues(alpha: 0.20) : cs.surfaceContainerHighest,
                  shape: BoxShape.circle,
                ),
                child: Icon(item.icon, size: 40, color: active ? Colors.white : cs.primary),
              ),
              const SizedBox(height: 12),
              Text(
                item.label,
                textAlign: TextAlign.center,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                  color: active ? Colors.white : cs.onSurface,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
