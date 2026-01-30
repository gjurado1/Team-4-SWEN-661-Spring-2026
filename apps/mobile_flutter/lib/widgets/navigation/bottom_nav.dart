import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppRole { caregiver, patient }

class BottomNav extends StatefulWidget {
  final String currentPath;
  final void Function(String path, {bool push}) onNavigate;

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

  @override
  void initState() {
    super.initState();
    _loadRole();
  }

  Future<void> _loadRole() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString('careconnect-role');
    if (!mounted) return;
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
        _NavItem(icon: Icons.home, label: 'Home', path: '/caregiver/dashboard'),
        _NavItem(icon: Icons.assignment, label: 'Patient List', path: '/caregiver/patients'),
        _NavItem(icon: Icons.bar_chart, label: 'Schedule', path: '/caregiver/schedule'),
        _NavItem(icon: Icons.message, label: 'Messages', path: '/messages'),
        _NavItem(icon: Icons.person, label: 'Profile', path: '/profile'),
        _NavItem(icon: Icons.settings, label: 'Settings', path: '/settings'),
        _NavItem(icon: Icons.warning_amber, label: 'Emergency', path: '/emergency'),
        _NavItem(
          icon: Icons.logout,
          label: 'Logout',
          path: '/login',
          onTap: () async => _logout(),
        ),
      ];
    }

    return [
      _NavItem(icon: Icons.home, label: 'Home', path: '/patient/dashboard'),
      _NavItem(icon: Icons.favorite, label: 'Check-In', path: '/patient/checkin'),
      _NavItem(icon: Icons.message, label: 'Messages', path: '/messages'),
      _NavItem(icon: Icons.person, label: 'Profile', path: '/profile'),
      _NavItem(icon: Icons.settings, label: 'Settings', path: '/settings'),
      _NavItem(icon: Icons.warning_amber, label: 'Emergency', path: '/emergency'),
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

    const pushRoutes = {'/settings', '/profile', '/messages', '/emergency'};
    final shouldPush = pushRoutes.contains(item.path);

    widget.onNavigate(item.path, push: shouldPush);
    if (!mounted) return;
    setState(() => _expanded = false);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    // Reserve bottom safe area
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
                    // Collapse header button (smaller, more React-like)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: cs.surface,
                        border: Border(bottom: BorderSide(color: theme.dividerColor, width: 2)),
                      ),
                      child: SizedBox(
                        height: 52,
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: () => setState(() => _expanded = false),
                          icon: const Icon(Icons.expand_more, size: 22),
                          label: const Text(
                            'Collapse Menu',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                          ),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: theme.dividerColor, width: 2),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                        ),
                      ),
                    ),

                    // Grid content (constrain width + compact tiles)
                    Expanded(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(16),
                        child: Center(
                          child: ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 720),
                            child: LayoutBuilder(
                              builder: (context, constraints) {
                                final crossAxisCount = constraints.maxWidth >= 720 ? 3 : 2;

                                return GridView.count(
                                  crossAxisCount: crossAxisCount,
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  mainAxisSpacing: 12,
                                  crossAxisSpacing: 12,
                                  // Wide buttons like React (was square-ish)
                                  childAspectRatio: 2.6,
                                  children: [
                                    for (final item in _items)
                                      _NavGridTile(
                                        item: item,
                                        active: widget.currentPath == item.path,
                                        onTap: () => _navigate(item),
                                      ),
                                  ],
                                );
                              },
                            ),
                          ),
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
                      const Icon(Icons.menu, size: 28),
                      const SizedBox(width: 10),
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

    // React-like compact sizes
    const iconSize = 26.0;
    const bubbleSize = 40.0;

    return Semantics(
      button: true,
      selected: active,
      label: item.label,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: active ? cs.primary : cs.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: active ? cs.primary : theme.dividerColor,
              width: 2,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: bubbleSize,
                height: bubbleSize,
                decoration: BoxDecoration(
                  color: active
                      ? Colors.white.withValues(alpha: 0.18)
                      : cs.surfaceContainerHighest,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  item.icon,
                  size: iconSize,
                  color: active ? Colors.white : cs.primary,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  item.label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                    color: active ? Colors.white : cs.onSurface,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
