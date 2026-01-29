import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

enum AppCarouselOrientation { horizontal, vertical }

class AppCarouselController {
  final PageController pageController;
  final AppCarouselOrientation orientation;

  final VoidCallback scrollPrev;
  final VoidCallback scrollNext;

  final bool Function() canScrollPrev;
  final bool Function() canScrollNext;

  const AppCarouselController({
    required this.pageController,
    required this.orientation,
    required this.scrollPrev,
    required this.scrollNext,
    required this.canScrollPrev,
    required this.canScrollNext,
  });
}

class AppCarousel extends StatefulWidget {
  final AppCarouselOrientation orientation;
  final ValueChanged<PageController>? setApi;
  final Widget child;

  const AppCarousel({
    super.key,
    this.orientation = AppCarouselOrientation.horizontal,
    this.setApi,
    required this.child,
  });

  static AppCarouselController controllerOf(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<_CarouselScope>();
    assert(scope != null, 'AppCarousel.controllerOf(context) called outside AppCarousel');
    return scope!.controller;
  }

  @override
  State<AppCarousel> createState() => _AppCarouselState();
}

class _AppCarouselState extends State<AppCarousel> {
  late final PageController _pageController;
  int _index = 0;
  int _count = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    widget.setApi?.call(_pageController);
  }

  void _setCount(int count) {
    if (_count != count) setState(() => _count = count);
  }

  void _onPageChanged(int i) => setState(() => _index = i);

  bool get _canPrev => _index > 0;
  bool get _canNext => _count == 0 ? false : _index < _count - 1;

  void _prev() {
    if (!_canPrev) return;
    _pageController.previousPage(duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
  }

  void _next() {
    if (!_canNext) return;
    _pageController.nextPage(duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
  }

  @override
  Widget build(BuildContext context) {
    // Keyboard arrows (stable API): Shortcuts + Actions
    final shortcuts = <ShortcutActivator, Intent>{
      const SingleActivator(LogicalKeyboardKey.arrowLeft): const _CarouselPrevIntent(),
      const SingleActivator(LogicalKeyboardKey.arrowRight): const _CarouselNextIntent(),
    };

    final actions = <Type, Action<Intent>>{
      _CarouselPrevIntent: CallbackAction<_CarouselPrevIntent>(onInvoke: (_) {
        _prev();
        return null;
      }),
      _CarouselNextIntent: CallbackAction<_CarouselNextIntent>(onInvoke: (_) {
        _next();
        return null;
      }),
    };

    final controller = AppCarouselController(
      pageController: _pageController,
      orientation: widget.orientation,
      scrollPrev: _prev,
      scrollNext: _next,
      canScrollPrev: () => _canPrev,
      canScrollNext: () => _canNext,
    );

    return _CarouselScope(
      controller: controller,
      setCount: _setCount,
      onPageChanged: _onPageChanged,
      child: Shortcuts(
        shortcuts: shortcuts,
        child: Actions(
          actions: actions,
          child: Focus(
            autofocus: false,
            child: widget.child,
          ),
        ),
      ),
    );
  }
}

class _CarouselScope extends InheritedWidget {
  final AppCarouselController controller;
  final void Function(int count) setCount;
  final ValueChanged<int> onPageChanged;

  const _CarouselScope({
    required super.child,
    required this.controller,
    required this.setCount,
    required this.onPageChanged,
  });

  @override
  bool updateShouldNotify(_CarouselScope oldWidget) => controller != oldWidget.controller;
}

class _CarouselPrevIntent extends Intent {
  const _CarouselPrevIntent();
}

class _CarouselNextIntent extends Intent {
  const _CarouselNextIntent();
}

class AppCarouselContent extends StatelessWidget {
  final int itemCount;
  final IndexedWidgetBuilder itemBuilder;
  final EdgeInsetsGeometry paddingBetweenItems;

  const AppCarouselContent({
    super.key,
    required this.itemCount,
    required this.itemBuilder,
    this.paddingBetweenItems = const EdgeInsets.only(left: 16),
  });

  @override
  Widget build(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<_CarouselScope>();
    assert(scope != null, 'AppCarouselContent must be used inside AppCarousel');
    scope!.setCount(itemCount);

    final c = scope.controller;

    return PageView.builder(
      controller: c.pageController,
      scrollDirection: c.orientation == AppCarouselOrientation.horizontal ? Axis.horizontal : Axis.vertical,
      onPageChanged: scope.onPageChanged,
      itemCount: itemCount,
      itemBuilder: (ctx, index) {
        return Padding(
          padding: index == 0 ? EdgeInsets.zero : paddingBetweenItems,
          child: SizedBox(width: double.infinity, child: itemBuilder(ctx, index)),
        );
      },
    );
  }
}

class AppCarouselPrevious extends StatelessWidget {
  final Widget icon;
  final String semanticLabel;

  const AppCarouselPrevious({
    super.key,
    this.icon = const Icon(Icons.arrow_back),
    this.semanticLabel = 'Previous slide',
  });

  @override
  Widget build(BuildContext context) {
    final c = AppCarousel.controllerOf(context);

    return IconButton(
      tooltip: semanticLabel,
      onPressed: c.canScrollPrev() ? c.scrollPrev : null,
      icon: icon,
    );
  }
}

class AppCarouselNext extends StatelessWidget {
  final Widget icon;
  final String semanticLabel;

  const AppCarouselNext({
    super.key,
    this.icon = const Icon(Icons.arrow_forward),
    this.semanticLabel = 'Next slide',
  });

  @override
  Widget build(BuildContext context) {
    final c = AppCarousel.controllerOf(context);

    return IconButton(
      tooltip: semanticLabel,
      onPressed: c.canScrollNext() ? c.scrollNext : null,
      icon: icon,
    );
  }
}
