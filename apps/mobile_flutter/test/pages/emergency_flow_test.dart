import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/pages/emergency_page.dart';
import '../helpers/test_harness.dart';

void main() {
  group('EmergencyPage SOS flow', () {
    testWidgets('Tap SOS opens confirm sheet', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      expect(find.text('SOS'), findsWidgets);
      await tester.tap(find.text('SOS'));
      await tester.pumpAndSettle();

      expect(find.text('Activate Emergency SOS?'), findsOneWidget);
      expect(find.text('Confirm Emergency'), findsOneWidget);
      expect(find.text('Cancel'), findsOneWidget);
    });

    testWidgets('Cancel closes confirm sheet', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('SOS'));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      expect(find.text('Activate Emergency SOS?'), findsNothing);
    });

    testWidgets('Confirm activates emergency banner', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('SOS'));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Confirm Emergency'));
      await tester.pumpAndSettle();

      expect(find.text('Emergency Activated'), findsOneWidget);
    });

    testWidgets('After activation, tapping SOS again does nothing (no confirm)', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      // Activate once
      await tester.tap(find.text('SOS'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Confirm Emergency'));
      await tester.pumpAndSettle();

      // Tap SOS again
      await tester.tap(find.text('SOS'));
      await tester.pumpAndSettle();

      expect(find.text('Activate Emergency SOS?'), findsNothing);
    });

    testWidgets('Call contact button exists (phone icon)', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      // At least one phone IconButton should be present
      expect(find.byIcon(Icons.phone), findsWidgets);
    });
  });
}
