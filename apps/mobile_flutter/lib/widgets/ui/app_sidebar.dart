import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

enum AppSidebarState { expanded, collapsed }

class AppSidebarController extends ChangeNotifier {
  AppSidebarState state;
  bool mobileOpen;

  AppSidebarController({
    this.state = AppSidebarState.expanded,
    this.mobileOpen = false,
  });

  bool get isExpanded => state == AppSidebarState.expanded;

  void toggle({required bool isMobile}) {
    if (isMobile) {
      mobileOpen = !mobileOpen;
    } else {
      state = isExpanded ? AppSidebarState.collapsed : AppSidebarState.expanded;
    }
    notifyListeners();
  }

  void setExpanded(bool expanded) {
    state = expanded ? AppSidebarState.expanded : AppSidebarState.collapsed;
    notifyListeners();
  }

  void setMobileOpen(bool open) {
    mobileOpen = open;
    notifyListeners();
  }
}

class AppSidebarProvider extends InheritedNotifier<AppSidebarController> {
  const AppSidebarProvider({
    super.key,
    required AppSidebarController controller,
    required super.child,
  }) : super(notifier: controller);

  static AppSidebarController of(BuildContext context) {
    final p = context.dependOnInheritedWidgetOfExactType<AppSidebarProvider>();
    assert(p != null, 'AppSidebarProvider.of(context) called without provider');
    return p!.notifier!;
  }
}

class AppSidebarTrigger extends StatelessWidget {
  final Widget icon;
  const AppSidebarTrigger({super.key, this.icon = const Icon(Icons.menu)});

  @override
  Widget build(BuildContext context) {
    final c = AppSidebarProvider.of(context);
    final isMobile = MediaQuery.of(context).size.width < 768;

    return IconButton(
      tooltip: 'Toggle Sidebar',
      onPressed: () => c.toggle(isMobile: isMobile),
      icon: icon,
    );
  }
}

/// Layout wrapper similar to Sidebar + SidebarInset.
/// Usage:
/// AppSidebarLayout(
///   sidebar: AppSidebar(...),
///   body: ...,
/// )
class AppSidebarLayout extends StatelessWidget {
  final Widget sidebar;
  final Widget body;

  const AppSidebarLayout({
    super.key,
    required this.sidebar,
    required this.body,
  });

  @override
  Widget build(BuildContext context) {
    final controller = AppSidebarProvider.of(context);
    final isMobile = MediaQuery.of(context).size.width < 768;

    // ctrl/cmd + b shortcut
    return Shortcuts(
      shortcuts: <ShortcutActivator, Intent>{
        const SingleActivator(LogicalKeyboardKey.keyB, control: true): const _ToggleSidebarIntent(),
        const SingleActivator(LogicalKeyboardKey.keyB, meta: true): const _ToggleSidebarIntent(),
      },
      child: Actions(
        actions: <Type, Action<Intent>>{
          _ToggleSidebarIntent: CallbackAction<_ToggleSidebarIntent>(
            onInvoke: (_) {
              controller.toggle(isMobile: isMobile);
              return null;
            },
          ),
        },
        child: Row(
          children: [
            if (!isMobile) sidebar,
            Expanded(child: body),
            if (isMobile)
              // mobile overlay
              AnimatedBuilder(
                animation: controller,
                builder: (_, __) {
                  if (!controller.mobileOpen) return const SizedBox.shrink();
                  return _MobileSidebarOverlay(
                    onClose: () => controller.setMobileOpen(false),
                    child: sidebar,
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}

class _ToggleSidebarIntent extends Intent {
  const _ToggleSidebarIntent();
}

class _MobileSidebarOverlay extends StatelessWidget {
  final VoidCallback onClose;
  final Widget child;

  const _MobileSidebarOverlay({required this.onClose, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: GestureDetector(
            onTap: onClose,
            child: Container(color: Colors.black.withValues(alpha: 0.5)),
          ),
        ),
        Align(
          alignment: Alignment.centerLeft,
          child: SizedBox(
            width: 320,
            child: Material(
              child: SafeArea(child: child),
            ),
          ),
        ),
      ],
    );
  }
}

/// The sidebar container. Provide expanded + collapsed builders (like "icon" collapsible).
class AppSidebar extends StatelessWidget {
  final Widget expanded;
  final Widget collapsed;
  final double width;
  final double collapsedWidth;

  const AppSidebar({
    super.key,
    required this.expanded,
    required this.collapsed,
    this.width = 256,
    this.collapsedWidth = 56,
  });

  @override
  Widget build(BuildContext context) {
    final c = AppSidebarProvider.of(context);
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return AnimatedBuilder(
      animation: c,
      builder: (_, __) {
        final isExpanded = c.isExpanded;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: isExpanded ? width : collapsedWidth,
          decoration: BoxDecoration(
            color: cs.surface,
            border: Border(right: BorderSide(color: theme.dividerColor, width: 2)),
          ),
          child: isExpanded ? expanded : collapsed,
        );
      },
    );
  }
}
