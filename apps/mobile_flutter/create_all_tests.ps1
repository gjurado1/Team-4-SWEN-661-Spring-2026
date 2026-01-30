# ===============================================
# CareConnect Flutter Test Generator
# Creates test/ folder + multiple widget tests
# ===============================================

Write-Host "Creating test directory structure..."

New-Item -ItemType Directory -Force -Path ".\test" | Out-Null
New-Item -ItemType Directory -Force -Path ".\test\pages" | Out-Null
New-Item -ItemType Directory -Force -Path ".\test\widgets" | Out-Null

function Write-FileUtf8NoBom {
    param([string]$Path, [string]$Content)
    $Utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($Path, $Content, $Utf8NoBom)
}

# =========================================================
# Simple Page Render Test Template Generator
# =========================================================
function New-PageTest {
param(
    [string]$FileName,
    [string]$ImportPath,
    [string]$WidgetName
)

$content = @"
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:mobile_flutter/theme/app_theme_scope.dart';
import '$ImportPath';

void main() {

  Future<Widget> buildTestApp() async {
    SharedPreferences.setMockInitialValues({
      'careconnect-role': 'caregiver',
    });

    final controller = AppThemeController();

    return AppThemeScope(
      controller: controller,
      child: const MaterialApp(
        home: $WidgetName(),
      ),
    );
  }

  testWidgets('$WidgetName renders correctly', (tester) async {
    final app = await buildTestApp();
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    expect(find.byType($WidgetName), findsOneWidget);
  });

}
"@

Write-FileUtf8NoBom ".\test\pages\$FileName" $content
}

# =========================================================
# Generate Page Tests
# =========================================================
New-PageTest "caregiver_dashboard_test.dart" "package:mobile_flutter/pages/caregiver_dashboard.dart" "CaregiverDashboard"
New-PageTest "emergency_page_test.dart" "package:mobile_flutter/pages/emergency_page.dart" "EmergencyPage"
New-PageTest "login_page_test.dart" "package:mobile_flutter/pages/login_page.dart" "LoginPage"
New-PageTest "medications_page_test.dart" "package:mobile_flutter/pages/medications_page.dart" "MedicationsPage"
New-PageTest "messages_page_test.dart" "package:mobile_flutter/pages/messages_page.dart" "MessagesPage"
New-PageTest "patient_dashboard_test.dart" "package:mobile_flutter/pages/patient_dashboard.dart" "PatientDashboard"
New-PageTest "profile_page_test.dart" "package:mobile_flutter/pages/profile_page.dart" "ProfilePage"
New-PageTest "schedule_page_test.dart" "package:mobile_flutter/pages/schedule_page.dart" "SchedulePage"
New-PageTest "settings_page_test.dart" "package:mobile_flutter/pages/settings_page.dart" "SettingsPage"
New-PageTest "symptoms_page_test.dart" "package:mobile_flutter/pages/symptoms_page.dart" "SymptomsPage"
New-PageTest "patient_checkin_page_test.dart" "package:mobile_flutter/pages/patient_checkin_page.dart" "PatientCheckInPage"
New-PageTest "forgot_password_page_test.dart" "package:mobile_flutter/pages/forgot_password_page.dart" "ForgotPasswordPage"

# =========================================================
# Bottom Navigation Test
# =========================================================
$bottomNavTest = @'
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
'@

Write-FileUtf8NoBom ".\test\widgets\bottom_nav_test.dart" $bottomNavTest

# =========================================================
# Router Navigation Coverage Test
# =========================================================
$routerNavigation = @'
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_flutter/router/app_router.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:mobile_flutter/theme/app_theme_scope.dart';

void main() {

  Future<Widget> buildApp(String role) async {
    SharedPreferences.setMockInitialValues({
      'careconnect-role': role,
    });

    final controller = AppThemeController();
    final router = buildRouter();

    return AppThemeScope(
      controller: controller,
      child: MaterialApp.router(
        routerConfig: router,
      ),
    );
  }

  testWidgets('Caregiver routes build', (tester) async {
    final app = await buildApp('caregiver');
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();

    final router = GoRouter.of(tester.element(find.byType(MaterialApp)));

    final routes = [
      '/caregiver/dashboard',
      '/caregiver/patients',
      '/caregiver/schedule',
      '/messages',
      '/profile',
      '/settings',
      '/emergency',
    ];

    for (final r in routes) {
      router.go(r);
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsWidgets);
    }
  });

  testWidgets('Patient routes build', (tester) async {
    final app = await buildApp('patient');
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();

    final router = GoRouter.of(tester.element(find.byType(MaterialApp)));

    final routes = [
      '/patient/dashboard',
      '/patient/checkin',
      '/patient/symptoms',
      '/patient/medications',
      '/patient/reports',
      '/messages',
      '/profile',
      '/settings',
      '/emergency',
    ];

    for (final r in routes) {
      router.go(r);
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsWidgets);
    }
  });
}
'@

Write-FileUtf8NoBom ".\test\pages\router_navigation_test.dart" $routerNavigation

Write-Host "==============================================="
Write-Host "All test files generated successfully."
Write-Host "Run: flutter test --coverage"
Write-Host "==============================================="
