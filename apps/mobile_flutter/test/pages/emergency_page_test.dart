import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:mobile_flutter/theme/app_theme_scope.dart';
import 'package:mobile_flutter/pages/emergency_page.dart';

void main() {

  Future<Widget> buildTestApp() async {
    SharedPreferences.setMockInitialValues({
      'careconnect-role': 'caregiver',
    });

    final controller = AppThemeController();

    return AppThemeScope(
      controller: controller,
      child: const MaterialApp(
        home: EmergencyPage(),
      ),
    );
  }

  testWidgets('EmergencyPage renders correctly', (tester) async {
    final app = await buildTestApp();
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    expect(find.byType(EmergencyPage), findsOneWidget);
  });

}