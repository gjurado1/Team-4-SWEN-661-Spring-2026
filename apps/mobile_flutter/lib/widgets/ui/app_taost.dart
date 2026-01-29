import 'dart:async';
import 'package:flutter/material.dart';

enum AppToastType { success, error, info }

class AppToaster {
  static OverlayEntry? _entry;
  static Timer? _timer;

  static void show(
    BuildContext context, {
    required AppToastType type,
    required String message,
    Duration duration = const Duration(milliseconds: 3000),
  }) {
    hide();

    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final (Color bg, IconData icon) = switch (type) {
      AppToastType.success => (const Color(0xFF2F855A), Icons.check_circle_outline),
      AppToastType.error => (cs.error, Icons.warning_amber_outlined),
      AppToastType.info => (cs.primary, Icons.info_outline),
    };

    _entry = OverlayEntry(
      builder: (_) {
        return Positioned(
          top: MediaQuery.of(context).padding.top + 16,
          right: 16,
          child: Material(
            color: Colors.transparent,
            child: _ToastCard(
              bg: bg,
              icon: icon,
              message: message,
              onClose: hide,
            ),
          ),
        );
      },
    );

    Overlay.of(context).insert(_entry!);

    if (duration.inMilliseconds > 0) {
      _timer = Timer(duration, hide);
    }
  }

  static void hide() {
    _timer?.cancel();
    _timer = null;
    _entry?.remove();
    _entry = null;
  }
}

class _ToastCard extends StatefulWidget {
  final Color bg;
  final IconData icon;
  final String message;
  final VoidCallback onClose;

  const _ToastCard({
    required this.bg,
    required this.icon,
    required this.message,
    required this.onClose,
  });

  @override
  State<_ToastCard> createState() => _ToastCardState();
}

class _ToastCardState extends State<_ToastCard> with SingleTickerProviderStateMixin {
  late final AnimationController _c;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 220))..forward();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _c,
      child: Container(
        constraints: const BoxConstraints(minWidth: 300, maxWidth: 420),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: widget.bg,
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [BoxShadow(blurRadius: 24, offset: Offset(0, 10))],
        ),
        child: Row(
          children: [
            Icon(widget.icon, color: Colors.white, size: 22),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                widget.message,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
              ),
            ),
            IconButton(
              onPressed: widget.onClose,
              icon: const Icon(Icons.close, color: Colors.white),
              tooltip: 'Close notification',
            ),
          ],
        ),
      ),
    );
  }
}
