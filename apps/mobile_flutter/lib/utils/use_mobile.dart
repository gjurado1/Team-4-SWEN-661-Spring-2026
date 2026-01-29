import 'package:flutter/widgets.dart';

bool isMobile(BuildContext context, {double breakpoint = 768}) {
  return MediaQuery.of(context).size.width < breakpoint;
}

extension ResponsiveX on BuildContext {
  bool get isMobile => MediaQuery.of(this).size.width < 768;
}
