import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_flutter/app.dart';

void main() {
  testWidgets('App boots', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
    await tester.pumpAndSettle(); // important
    expect(find.text('Login'), findsOneWidget);
  });
}
