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
  _SheetMode? _sheetMode;
  bool _active = false;

  void _openSheet(_SheetMode mode) {
    setState(() {
      _popoverOpen = false;
      _sheetMode = mode;
      _active = false;
    });
  }

  void _closeSheet() {
    setState(() {
      _sheetMode = null;
      _active = false;
    });
  }

  String get _sheetTitle => _sheetMode == _SheetMode.read ? 'Read Screen' : 'Voice Command';

  String get _sheetDescription => _sheetMode == _SheetMode.read
      ? 'UI preview: this would read the current screen aloud.'
      : 'UI preview: this would listen for voice commands to control the app.';

  String get _primaryLabel {
    if (_sheetMode == _SheetMode.read) return _active ? 'Stop Reading' : 'Start Reading';
    return _active ? 'Stop Listening' : 'Start Listening';
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
        // mic + popover anchor
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

        // Sheet modal
        if (_sheetMode != null)
          Positioned.fill(
            child: _BottomSheetOverlay(
              title: _sheetTitle,
              description: _sheetDescription,
              active: _active,
              primaryLabel: _primaryLabel,
              onToggle: () => setState(() => _active = !_active),
              onClose: _closeSheet,
            ),
          ),
      ],
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
    if (widget.isOpen && _entry == null) _show();
    if (!widget.isOpen && _entry != null) _hide();
  }

  void _show() {
    _entry = OverlayEntry(
      builder: (context) {
        final theme = Theme.of(context);
        final cs = theme.colorScheme;

        return Positioned.fill(
          child: Stack(
            children: [
              GestureDetector(onTap: widget.onClose, child: const SizedBox.expand()),
              CompositedTransformFollower(
                link: _link,
                targetAnchor: Alignment.bottomRight,
                followerAnchor: Alignment.topRight,
                offset: const Offset(0, 12),
                child: Material(
                  color: Colors.transparent,
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      maxWidth: 520,
                      minWidth: 280,
                      // mimic min(520px, 92vw)
                    ),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: cs.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: theme.dividerColor, width: 2),
                        boxShadow: const [BoxShadow(blurRadius: 18, offset: Offset(0, 10))],
                      ),
                      child: widget.popover,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );

    Overlay.of(context).insert(_entry!);
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
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Voice Options', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
        const SizedBox(height: 4),
        Text('Choose how you want to use voice', style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
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
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: background,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: theme.dividerColor, width: 2),
        ),
        child: Row(
          children: [
            Icon(icon, size: 22, color: iconColor),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BottomSheetOverlay extends StatelessWidget {
  final String title;
  final String description;
  final bool active;
  final String primaryLabel;
  final VoidCallback onToggle;
  final VoidCallback onClose;

  const _BottomSheetOverlay({
    required this.title,
    required this.description,
    required this.active,
    required this.primaryLabel,
    required this.onToggle,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;
    final bottomPad = MediaQuery.of(context).padding.bottom;

    return Stack(
      children: [
        // dim overlay
        Positioned.fill(
          child: GestureDetector(
            onTap: onClose,
            child: Container(color: Colors.black.withValues(alpha: 0.40)),
          ),
        ),

        // sheet
        Align(
          alignment: Alignment.bottomCenter,
          child: Material(
            color: cs.surface,
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
              child: SafeArea(
                top: false,
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
                              Text(title, style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
                              const SizedBox(height: 6),
                              Text(description, style: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor)),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        InkWell(
                          onTap: onClose,
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

                    // big actions
                    SizedBox(
                      width: double.infinity,
                      height: 64,
                      child: ElevatedButton.icon(
                        onPressed: onToggle,
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
                        onPressed: onClose,
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
        ),
      ],
    );
  }
}
