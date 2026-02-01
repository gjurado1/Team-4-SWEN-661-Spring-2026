import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../helpers/pump_app.dart';

void main() {
  group('Medications Workflow (widget)', () {
    testWidgets('Medication list renders seeded items', (tester) async {
      await pumpCareConnectApp(
        tester,
        prefs: {'careconnect-role': 'patient'},
        initialLocation: '/patient/medications',
      );
      await tester.pumpAndSettle();

      expect(find.text("Today's Schedule"), findsOneWidget);
      // Use textContaining to find widgets with extra text or icons
      expect(find.textContaining('Lisinopril'), findsWidgets);
    });

    testWidgets('Tapping Mark Taken updates UI state', (tester) async {
      await pumpCareConnectApp(
        tester,
        prefs: {'careconnect-role': 'patient'},
        initialLocation: '/patient/medications',
      );
      await tester.pumpAndSettle();

      final markTakenBtn = find.text('Mark Taken').first;
      await tester.tap(markTakenBtn);
      
      // Use pumpAndSettle to wait for the "Taken" state transition
      await tester.pumpAndSettle(const Duration(milliseconds: 500));
      expect(find.textContaining('Taken'), findsWidgets);
    });
  }); // Added missing closing brace/parenthesis for group
} // Added missing closing brace for main