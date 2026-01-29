import 'package:flutter/material.dart';

class AppCollapsibleController extends ValueNotifier<bool> {
  AppCollapsibleController({bool open = false}) : super(open);
  bool get isOpen => value;
  void toggle() => value = !value;
  void open() => value = true;
  void close() => value = false;
}

class AppCollapsible extends StatelessWidget {
  final AppCollapsibleController controller;
  final Widget child;

  const AppCollapsible({
    super.key,
    required this.controller,
    required this.child,
  });

  static _CollapsibleScope of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<_CollapsibleScope>();
    assert(scope != null, 'AppCollapsible.of(context) called outside AppCollapsible');
    return scope!;
  }

  @override
  Widget build(BuildContext context) {
    return _CollapsibleScope(controller: controller, child: child);
  }
}

class _CollapsibleScope extends InheritedWidget {
  final AppCollapsibleController controller;
  const _CollapsibleScope({required this.controller, required super.child});

  @override
  bool updateShouldNotify(_CollapsibleScope oldWidget) => controller != oldWidget.controller;
}

class AppCollapsibleTrigger extends StatelessWidget {
  final Widget child;
  final VoidCallback? onPressed;

  const AppCollapsibleTrigger({super.key, required this.child, this.onPressed});

  @override
  Widget build(BuildContext context) {
    final c = AppCollapsible.of(context).controller;

    return InkWell(
      onTap: onPressed ?? c.toggle,
      child: child,
    );
  }
}

class AppCollapsibleContent extends StatelessWidget {
  final Widget child;
  final Duration duration;

  const AppCollapsibleContent({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 200),
  });

  @override
  Widget build(BuildContext context) {
    final c = AppCollapsible.of(context).controller;

    return ValueListenableBuilder<bool>(
      valueListenable: c,
      builder: (_, open, __) {
        return AnimatedSize(
          duration: duration,
          curve: Curves.easeOut,
          child: open ? child : const SizedBox.shrink(),
        );
      },
    );
  }
}
