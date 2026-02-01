import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../helpers/pump_app.dart';

Future<void> _openExpansionTileByTitle(WidgetTester tester, String title) async {
  final tileFinder = find.text(title);

  expect(tileFinder, findsAtLeastNWidgets(1),
      reason: 'No widget found with exact text: "$title"');

  final target = tileFinder.first;

  await tester.scrollUntilVisible(
    target,
    150.0,
    maxScrolls: 30,
    duration: const Duration(milliseconds: 60),
  );

  await tester.pumpAndSettle(const Duration(milliseconds: 300));

  await tester.tap(target, warnIfMissed: false);
  await tester.pumpAndSettle(const Duration(milliseconds: 800));
}

Future<void> _expandAccessibilityTiles(WidgetTester tester) async {
  await tester.pumpAndSettle(const Duration(milliseconds: 200));
  await _openExpansionTileByTitle(tester, 'Vision Theme');
  await tester.pumpAndSettle(const Duration(milliseconds: 400));
}

void main() {
  group('Settings + Accessibility (widget)', () {
    testWidgets('Settings page renders and contains accessibility widgets', (tester) async {
      await pumpCareConnectApp(
        tester,
        prefs: {'careconnect-role': 'caregiver'},
        initialLocation: '/settings',
      );

      await _expandAccessibilityTiles(tester);

      expect(find.text('Settings'), findsWidgets);
      expect(find.text('Accessibility Preferences'), findsOneWidget);

      // Theme / vision related content
      expect(find.text('Contrast and color settings'), findsOneWidget);

      // Text size section
      expect(find.text('Text Size'), findsOneWidget);
      expect(find.text('Adjust font size'), findsOneWidget);
      expect(find.textContaining('Sample text at current size'), findsOneWidget);

      // Voice section labels
      expect(find.text('Voice Features'), findsOneWidget);
      expect(find.text('Read Aloud'), findsOneWidget);
      expect(find.text('Voice Commands'), findsOneWidget);
    });

    testWidgets('Read Aloud toggle can be tapped and persists to SharedPreferences', (tester) async {
      SharedPreferences.setMockInitialValues({'careconnect-role': 'caregiver'});

      await pumpCareConnectApp(
        tester,
        prefs: {'careconnect-role': 'caregiver'},
        initialLocation: '/settings',
      );

      await _expandAccessibilityTiles(tester);

      // Robust finder: checks for SwitchListTile, then Switch, then fallback to text
      Finder targetFinder;
      final switchListTileFinder = find.widgetWithText(SwitchListTile, 'Read Aloud');

      if (tester.widgetList(switchListTileFinder).isNotEmpty) {
        targetFinder = switchListTileFinder;
      } else {
        final switchFinder = find.byType(Switch);
        if (tester.widgetList(switchFinder).isNotEmpty) {
          // If a standalone Switch exists (e.g. inside a custom Row), tap that.
          targetFinder = switchFinder.first;
        } else {
          // Fallback: tap the text label (works if wrapped in InkWell)
          targetFinder = find.text('Read Aloud');
        }
      }

      expect(targetFinder, findsOneWidget, 
          reason: 'Could not identify the Read Aloud interactive element');

      // Ensure visible and tap
      await tester.ensureVisible(targetFinder);
      await tester.pumpAndSettle();
      await tester.tap(targetFinder, warnIfMissed: false);
      
      // Wait for async save operations
      await tester.pumpAndSettle(const Duration(milliseconds: 1000));

      final prefs = await SharedPreferences.getInstance();
      
      final readAloudValue = prefs.getBool('careconnect-read-aloud') ??
                             prefs.getBool('read_aloud_enabled') ??
                             prefs.getBool('readAloud');

      expect(readAloudValue, isNotNull,
          reason: 'No read-aloud preference was saved to SharedPreferences');
    });

    testWidgets('Voice Commands toggle exists', (tester) async {
      await pumpCareConnectApp(
        tester,
        prefs: {'careconnect-role': 'caregiver'},
        initialLocation: '/settings',
      );

      await _expandAccessibilityTiles(tester);

      final voiceCommandsLabel = find.text('Voice Commands');
      expect(voiceCommandsLabel, findsOneWidget, reason: 'Missing Voice Commands label');
      
      // Check for something tappable near the label
      final tappableNearVoice = find.ancestor(
        of: voiceCommandsLabel,
        matching: find.byWidgetPredicate((w) =>
            w is GestureDetector ||
            w is InkWell ||
            w is IconButton ||
            w is Material ||
            w is Switch ||
            w is SwitchListTile ||
            w.runtimeType.toString().contains('Toggle') ||
            w.runtimeType.toString().contains('Button')),
      );
      
      expect(tappableNearVoice, findsWidgets, reason: 'No tappable widget found near "Voice Commands"');
    });

    testWidgets('Back button exists and can be tapped without crashing', (tester) async {
      await pumpCareConnectApp(
        tester,
        prefs: {'careconnect-role': 'caregiver'},
        initialLocation: '/settings',
      );

      expect(find.byTooltip('Back'), findsOneWidget);

      await tester.tap(find.byTooltip('Back'), warnIfMissed: false);
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull,
          reason: 'Exception thrown after tapping back button');
    });
  });
}