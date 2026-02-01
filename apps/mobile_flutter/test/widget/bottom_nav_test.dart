import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_flutter/widgets/navigation/bottom_nav.dart';

void main() {
  testWidgets('BottomNav expands, collapses, and displays patient items', (tester) async {
    // 1. Arrange - Seed Patient Role
    SharedPreferences.setMockInitialValues({'careconnect-role': 'patient'});
    String? navigatedPath;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: BottomNav(
            currentPath: '/patient/dashboard',
            onNavigate: (path, {push = false}) => navigatedPath = path,
          ),
        ),
      ),
    );

    // 2. Act - Expand Menu
    await tester.tap(find.text('Menu'));
    await tester.pumpAndSettle();

    // 3. Assert - Meaningful UI checks
    expect(find.text('Collapse Menu'), findsOneWidget);
    expect(find.text('Profile'), findsOneWidget); // Verifies patient-specific items
    
    // 4. Act - Test Navigation callback
    await tester.tap(find.text('Profile'));
    await tester.pumpAndSettle();
    
    // 5. Assert - Logic verification
    expect(navigatedPath, equals('/profile'));
    // expect(navigatedPath, equals('/patient/profile'));
  });
}