import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_flutter/app.dart';

/// Use this when you want to boot the whole app (routing + layout).
Widget createAppHarness() {
  return const ProviderScope(child: CareConnectApp());
}

/// Use this when you want to test one screen widget in isolation.
Widget createScreenHarness({required Widget child}) {
  return ProviderScope(
    child: MaterialApp(home: child),
  );
}
