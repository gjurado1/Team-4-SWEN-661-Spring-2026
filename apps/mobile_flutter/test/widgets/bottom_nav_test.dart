import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_flutter/widgets/navigation/bottom_nav.dart';

void main() {
  testWidgets('BottomNav expands and collapses', (tester) async {

    SharedPreferences.setMockInitialValues({
      'careconnect-role': 'caregiver',
    });

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: BottomNav(
            currentPath: '/caregiver/dashboard',
            onNavigate: _noop,
          ),
        ),
      ),
    );

    await tester.tap(find.text('Menu'));
    await tester.pumpAndSettle();

    expect(find.text('Collapse Menu'), findsOneWidget);
  });
}

void _noop(String path, {bool push = false}) {}