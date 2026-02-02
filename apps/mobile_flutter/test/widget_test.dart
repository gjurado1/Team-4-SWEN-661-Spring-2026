import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_flutter/app.dart';

void main() {
  testWidgets('App boots', (tester) async {
    // 1. Wrap in ProviderScope as you did
    await tester.pumpWidget(
      const ProviderScope(
        child: CareConnectApp(),
      ),
    );

    // 2. Add this line! It waits for animations and routing to finish.
    await tester.pumpAndSettle();

    // 3. Now check for the text
    expect(find.text('Sign In'), findsOneWidget);
  });
}
