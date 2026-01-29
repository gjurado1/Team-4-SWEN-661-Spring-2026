import 'package:flutter/material.dart';

enum AppSheetSide { top, right, bottom, left }

class AppSheet extends StatelessWidget {
  final bool isOpen;
  final VoidCallback onClose;
  final AppSheetSide side;

  final Widget child;
  final double widthFraction; // right/left width = 0.75 of screen
  final double? maxWidth; // like sm:max-w-sm

  const AppSheet({
    super.key,
    required this.isOpen,
    required this.onClose,
    required this.child,
    this.side = AppSheetSide.right,
    this.widthFraction = 0.75,
    this.maxWidth = 420,
  });

  @override
  Widget build(BuildContext context) {
    if (!isOpen) return const SizedBox.shrink();

    final theme = Theme.of(context);
    final cs = theme.colorScheme;
    final size = MediaQuery.of(context).size;

    final isVertical = side == AppSheetSide.top || side == AppSheetSide.bottom;

    double w = size.width * widthFraction;
    if (maxWidth != null) w = w.clamp(0.0, maxWidth!);

    final sheet = Material(
      color: cs.surface,
      child: SafeArea(
        child: Stack(
          children: [
            Positioned.fill(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: child,
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                tooltip: 'Close',
                onPressed: onClose,
                icon: const Icon(Icons.close),
              ),
            ),
          ],
        ),
      ),
    );

    Alignment align = switch (side) {
      AppSheetSide.right => Alignment.centerRight,
      AppSheetSide.left => Alignment.centerLeft,
      AppSheetSide.top => Alignment.topCenter,
      AppSheetSide.bottom => Alignment.bottomCenter,
    };

    BorderSide border = BorderSide(color: theme.dividerColor, width: 2);

    Widget framed = Container(
      width: isVertical ? double.infinity : w,
      height: isVertical ? null : double.infinity,
      decoration: BoxDecoration(
        border: switch (side) {
          AppSheetSide.right => Border(left: border),
          AppSheetSide.left => Border(right: border),
          AppSheetSide.top => Border(bottom: border),
          AppSheetSide.bottom => Border(top: border),
        },
        boxShadow: const [BoxShadow(blurRadius: 18, offset: Offset(0, 8))],
      ),
      child: sheet,
    );

    // Basic slide-in animation
    final beginOffset = switch (side) {
      AppSheetSide.right => const Offset(1, 0),
      AppSheetSide.left => const Offset(-1, 0),
      AppSheetSide.top => const Offset(0, -1),
      AppSheetSide.bottom => const Offset(0, 1),
    };

    return Stack(
      children: [
        Positioned.fill(
          child: GestureDetector(
            onTap: onClose,
            child: Container(color: Colors.black.withValues(alpha: 0.5)),
          ),
        ),
        Align(
          alignment: align,
          child: TweenAnimationBuilder<Offset>(
            tween: Tween(begin: beginOffset, end: Offset.zero),
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
            builder: (context, offset, child) => FractionalTranslation(
              translation: offset,
              child: child,
            ),
            child: framed,
          ),
        ),
      ],
    );
  }
}

class AppSheetHeader extends StatelessWidget {
  final Widget child;
  const AppSheetHeader({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 48, 8),
      child: child,
    );
  }
}

class AppSheetFooter extends StatelessWidget {
  final Widget child;
  const AppSheetFooter({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: child,
    );
  }
}

class AppSheetTitle extends StatelessWidget {
  final String text;
  const AppSheetTitle(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Text(text, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700));
  }
}

class AppSheetDescription extends StatelessWidget {
  final String text;
  const AppSheetDescription(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Text(text, style: Theme.of(context).textTheme.bodySmall);
  }
}
