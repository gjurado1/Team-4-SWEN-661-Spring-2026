import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/widgets/navigation/header_voice_button.dart';
import '../helpers/test_harness.dart';

void main() {
  group('HeaderVoiceButton interactions', () {
    testWidgets('Tapping mic opens popover', (tester) async {
      await tester.pumpWidget(
        createTestHarness(
          child: const Scaffold(
            body: Center(child: HeaderVoiceButton()),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();

      expect(find.text('Voice Options'), findsOneWidget);
      expect(find.text('Read Screen'), findsOneWidget);
      expect(find.text('Voice Command'), findsOneWidget);
    });

    testWidgets('Tapping outside closes popover', (tester) async {
      await tester.pumpWidget(
        createTestHarness(
          child: const Scaffold(
            body: Center(child: HeaderVoiceButton()),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();
      expect(find.text('Voice Options'), findsOneWidget);

      // Tap somewhere else
      await tester.tapAt(const Offset(5, 5));
      await tester.pumpAndSettle();
      expect(find.text('Voice Options'), findsNothing);
    });

    testWidgets('Read Screen opens bottom sheet', (tester) async {
      await tester.pumpWidget(
        createTestHarness(
          child: const Scaffold(
            body: Center(child: HeaderVoiceButton()),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Read Screen'));
      await tester.pumpAndSettle();

      expect(find.text('Read Screen'), findsWidgets);
      expect(find.textContaining('UI preview', findRichText: true), findsWidgets);
      expect(find.textContaining('Start', findRichText: true), findsWidgets);
    });

    testWidgets('Voice Command opens bottom sheet', (tester) async {
      await tester.pumpWidget(
        createTestHarness(
          child: const Scaffold(
            body: Center(child: HeaderVoiceButton()),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Voice Command'));
      await tester.pumpAndSettle();

      expect(find.text('Voice Command'), findsWidgets);
    });

    testWidgets('Bottom sheet toggle changes button label', (tester) async {
      await tester.pumpWidget(
        createTestHarness(
          child: const Scaffold(
            body: Center(child: HeaderVoiceButton()),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.mic));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Voice Command'));
      await tester.pumpAndSettle();

      // Tap Start Listening
      expect(find.textContaining('Start', findRichText: true), findsWidgets);
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle();

      // Should now contain Stop
      expect(find.textContaining('Stop', findRichText: true), findsWidgets);
    });
  });
}
