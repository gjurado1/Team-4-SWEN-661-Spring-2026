import 'package:flutter/material.dart';

enum HeaderVoiceVariant { defaultVariant, inverted }
enum _SheetMode { read, command }

class HeaderVoiceButton extends StatefulWidget {
  final HeaderVoiceVariant variant;

  const HeaderVoiceButton({
    super.key,
    this.variant = HeaderVoiceVariant.defaultVariant,
  });

  @override
  State<HeaderVoiceButton> createState() => _HeaderVoiceButtonState();
}

class _HeaderVoiceButtonState extends State<HeaderVoiceButton> {
  bool _popoverOpen = false;

  void _openSheet(_SheetMode mode) {
    setState(() => _popoverOpen = false);

    final title = mode == _SheetMode.read ? 'Read Screen' : 'Voice Command';
    final description = mode == _SheetMode.read
        ? 'UI preview: this would read the current screen aloud.'
        : 'UI preview: this would listen for voice commands to control the app.';

    showModalBottomSheet(
      context: context,
      useRootNavigator: true, // ✅ important with ShellRoute / nested navigators
      isScrollControlled: true,
      showDragHandle: false,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withValues(alpha: 0.40),
      builder: (sheetContext) {
        return _VoiceBottomSheet(
          title: title,
          description: description,
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final inverted = widget.variant == HeaderVoiceVariant.inverted;

    final btnBg = inverted ? Colors.white.withValues(alpha: 0.15) : cs.surface;
    final btnBorder = inverted ? Colors.white.withValues(alpha: 0.70) : theme.dividerColor;
    final btnIconColor = inverted ? Colors.white : cs.onSurface;

    return Stack(
      children: [
        _PopoverAnchor(
          isOpen: _popoverOpen,
          onClose: () => setState(() => _popoverOpen = false),
          popover: _VoicePopover(
            onRead: () => _openSheet(_SheetMode.read),
            onCommand: () => _openSheet(_SheetMode.command),
          ),
          child: Semantics(
            button: true,
            label: 'Voice options',
            child: InkWell(
              onTap: () => setState(() => _popoverOpen = !_popoverOpen),
              borderRadius: BorderRadius.circular(12),
              child: Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: btnBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: btnBorder, width: 2),
                ),
                child: Center(
                  child: Icon(Icons.mic, size: 28, color: btnIconColor),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// Bottom sheet content (real modal bottom sheet)
class _VoiceBottomSheet extends StatefulWidget {
  final String title;
  final String description;

  const _VoiceBottomSheet({
    required this.title,
    required this.description,
  });

  @override
  State<_VoiceBottomSheet> createState() => _VoiceBottomSheetState();
}

class _VoiceBottomSheetState extends State<_VoiceBottomSheet> {
  bool active = false;

  String get primaryLabel {
    final isRead = widget.title == 'Read Screen';
    if (isRead) return active ? 'Stop Reading' : 'Start Reading';
    return active ? 'Stop Listening' : 'Start Listening';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;
    final bottomPad = MediaQuery.of(context).padding.bottom;

    return SafeArea(
      top: false,
      child: Align(
        alignment: Alignment.bottomCenter,
        child: Material(
          color: cs.surface,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
          ),
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.fromLTRB(20, 12, 20, bottomPad + 16),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: theme.dividerColor, width: 2)),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // drag handle
                Container(
                  height: 6,
                  width: 72,
                  decoration: BoxDecoration(
                    color: theme.dividerColor,
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
                const SizedBox(height: 12),

                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.title,
                            style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            widget.description,
                            style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    InkWell(
                      onTap: () => Navigator.of(context).pop(),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: cs.surfaceContainerHighest,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: theme.dividerColor, width: 2),
                        ),
                        child: Icon(Icons.close, size: 26, color: cs.onSurface),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // status card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: cs.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: theme.dividerColor, width: 2),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Status: ${active ? "ON" : "OFF"}',
                        style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w800),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'UI-only preview. Buttons below simulate starting/stopping.',
                        style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                SizedBox(
                  width: double.infinity,
                  height: 64,
                  child: ElevatedButton.icon(
                    onPressed: () => setState(() => active = !active),
                    icon: Icon(active ? Icons.stop : Icons.play_arrow, size: 22),
                    label: Text(primaryLabel, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: cs.primary,
                      foregroundColor: cs.onPrimary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 64,
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: OutlinedButton.styleFrom(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      side: BorderSide(color: theme.dividerColor, width: 2),
                    ),
                    child: const Text('Close', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Popover that positions itself under the trigger (basic anchored overlay).
class _PopoverAnchor extends StatefulWidget {
  final Widget child;
  final Widget popover;
  final bool isOpen;
  final VoidCallback onClose;

  const _PopoverAnchor({
    required this.child,
    required this.popover,
    required this.isOpen,
    required this.onClose,
  });

  @override
  State<_PopoverAnchor> createState() => _PopoverAnchorState();
}

class _PopoverAnchorState extends State<_PopoverAnchor> {
  final _link = LayerLink();
  OverlayEntry? _entry;

  @override
  void didUpdateWidget(covariant _PopoverAnchor oldWidget) {
    super.didUpdateWidget(oldWidget);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (widget.isOpen && _entry == null) _show();
      if (!widget.isOpen && _entry != null) _hide();
    });
  }

  void _show() {
    if (_entry != null) return;

    _entry = OverlayEntry(
      builder: (context) {
        final theme = Theme.of(context);
        final cs = theme.colorScheme;

        final screenW = MediaQuery.of(context).size.width;
        final popW = screenW < 420 ? screenW - 24.0 : 340.0; // ✅ tight like screenshot

        return Stack(
          fit: StackFit.expand,
          children: [
            GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: widget.onClose,
              child: const SizedBox.expand(),
            ),
            CompositedTransformFollower(
              link: _link,
              targetAnchor: Alignment.bottomRight,
              followerAnchor: Alignment.topRight,
              offset: const Offset(0, 10),
              showWhenUnlinked: false,
              child: Material(
                color: Colors.transparent,
                child: Align(
                  alignment: Alignment.topRight,
                  child: SizedBox(
                    width: popW,
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: cs.surface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: theme.dividerColor, width: 2),
                        boxShadow: [
                          BoxShadow(
                            blurRadius: 18,
                            offset: const Offset(0, 10),
                            color: Colors.black.withValues(alpha: 0.18),
                          ),
                        ],
                      ),
                      child: widget.popover,
                    ),
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );

    final overlay = Overlay.of(context, rootOverlay: true);
    overlay.insert(_entry!);
  }

  void _hide() {
    _entry?.remove();
    _entry = null;
  }

  @override
  void dispose() {
    _hide();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CompositedTransformTarget(link: _link, child: widget.child);
  }
}

class _VoicePopover extends StatelessWidget {
  final VoidCallback onRead;
  final VoidCallback onCommand;

  const _VoicePopover({
    required this.onRead,
    required this.onCommand,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Column(
      mainAxisSize: MainAxisSize.min, // ✅ shrink wrap
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Voice Options',
          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 4),
        Text(
          'Choose how you want to use voice',
          style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
        ),
        const SizedBox(height: 12),
        _ActionTile(
          icon: Icons.volume_up,
          iconColor: cs.primary,
          title: 'Read Screen',
          subtitle: 'Have the app read this page aloud',
          background: cs.primary.withValues(alpha: 0.10),
          onTap: onRead,
        ),
        const SizedBox(height: 10),
        _ActionTile(
          icon: Icons.mic,
          iconColor: cs.primary,
          title: 'Voice Command',
          subtitle: 'Control the app using your voice',
          background: cs.surfaceContainerHighest,
          onTap: onCommand,
        ),
      ],
    );
  }
}

class _ActionTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final Color background;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.background,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10), // ✅ tighter tile
        decoration: BoxDecoration(
          color: background,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: theme.dividerColor, width: 1.5),
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: iconColor),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
