# create_more_page_tests.ps1
# Run from project root:
#   powershell -ExecutionPolicy Bypass -File .\create_more_page_tests.ps1
#
# Then:
#   flutter test --coverage

$ErrorActionPreference = "Stop"

function Write-FileUtf8NoBom($Path, $Content) {
  $dir = Split-Path -Parent $Path
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
  Write-Host "Wrote: $Path"
}

New-Item -ItemType Directory -Force -Path ".\test\helpers" | Out-Null
New-Item -ItemType Directory -Force -Path ".\test\pages"   | Out-Null
New-Item -ItemType Directory -Force -Path ".\test\unit"    | Out-Null

# -------------------------------------------------------------------
# test/helpers/test_harness.dart
# -------------------------------------------------------------------
$testHarness = @'
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/router/app_router.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:mobile_flutter/theme/app_theme_scope.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> setMockPrefs(Map<String, Object> values) async {
  TestWidgetsFlutterBinding.ensureInitialized();
  SharedPreferences.setMockInitialValues(values);
}

Widget createTestHarness({
  required Widget child,
  AppThemeController? controller,
}) {
  final c = controller ?? AppThemeController();

  return AppThemeScope(
    controller: c,
    child: MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Builder(
        builder: (context) {
          final mq = MediaQuery.of(context);
          return MediaQuery(
            data: mq.copyWith(textScaler: TextScaler.linear(c.textScaleFactor)),
            child: child,
          );
        },
      ),
    ),
  );
}

Widget createRouterHarness({
  AppThemeController? controller,
}) {
  final c = controller ?? AppThemeController();
  final router = buildRouter();

  return AppThemeScope(
    controller: c,
    child: MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      builder: (context, child) {
        final mq = MediaQuery.of(context);
        return MediaQuery(
          data: mq.copyWith(textScaler: TextScaler.linear(c.textScaleFactor)),
          child: child!,
        );
      },
    ),
  );
}
'@
Write-FileUtf8NoBom ".\test\helpers\test_harness.dart" $testHarness

# -------------------------------------------------------------------
# test/pages/page_render_smoke_test.dart
# -------------------------------------------------------------------
$pageSmoke = @'
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile_flutter/pages/caregiver_dashboard.dart';
import 'package:mobile_flutter/pages/emergency_page.dart';
import 'package:mobile_flutter/pages/login_page.dart';
import 'package:mobile_flutter/pages/medications_page.dart';
import 'package:mobile_flutter/pages/messages_page.dart';
import 'package:mobile_flutter/pages/patient_dashboard.dart';
import 'package:mobile_flutter/pages/profile_page.dart';
import 'package:mobile_flutter/pages/schedule_page.dart';
import 'package:mobile_flutter/pages/settings_page.dart';

import '../helpers/test_harness.dart';

void main() {
  group('Smoke render: pages build without crashing', () {
    testWidgets('LoginPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('CaregiverDashboard renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const CaregiverDashboard()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('PatientDashboard renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const PatientDashboard()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('MessagesPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const MessagesPage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('MedicationsPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const MedicationsPage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('SchedulePage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SchedulePage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('SettingsPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SettingsPage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('ProfilePage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const ProfilePage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('EmergencyPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });
  });
}
'@
Write-FileUtf8NoBom ".\test\pages\page_render_smoke_test.dart" $pageSmoke

# -------------------------------------------------------------------
# test/pages/login_interaction_test.dart
# -------------------------------------------------------------------
$loginInteraction = @'
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/pages/login_page.dart';
import '../helpers/test_harness.dart';

void main() {
  group('LoginPage interactions', () {
    testWidgets('Has at least 2 text fields (email/password)', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();
      expect(find.byType(TextField), findsAtLeastNWidgets(2));
    });

    testWidgets('Can type in first TextField', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();

      final fields = find.byType(TextField);
      expect(fields, findsAtLeastNWidgets(1));

      await tester.enterText(fields.first, 'test@example.com');
      await tester.pump();

      expect(find.byType(TextField), findsWidgets);
    });

    testWidgets('Tapping any buttons does not crash', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const LoginPage()));
      await tester.pumpAndSettle();

      final elevated = find.byType(ElevatedButton);
      if (elevated.evaluate().isNotEmpty) {
        await tester.tap(elevated.first);
        await tester.pumpAndSettle();
      }

      final outlined = find.byType(OutlinedButton);
      if (outlined.evaluate().isNotEmpty) {
        await tester.tap(outlined.first);
        await tester.pumpAndSettle();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });
  });
}
'@
Write-FileUtf8NoBom ".\test\pages\login_interaction_test.dart" $loginInteraction

# -------------------------------------------------------------------
# test/pages/settings_interaction_test.dart
# -------------------------------------------------------------------
$settingsInteraction = @'
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile_flutter/pages/settings_page.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:mobile_flutter/widgets/accessibility/theme_selector.dart';
import 'package:mobile_flutter/widgets/accessibility/text_size_control.dart';

import '../helpers/test_harness.dart';

void main() {
  group('SettingsPage + accessibility widgets', () {
    testWidgets('SettingsPage contains ThemeSelector or TextSizeControl', (tester) async {
      final controller = AppThemeController();

      await tester.pumpWidget(
        createTestHarness(
          controller: controller,
          child: const SettingsPage(),
        ),
      );
      await tester.pumpAndSettle();

      final hasThemeSelector = find.byType(ThemeSelector).evaluate().isNotEmpty;
      final hasTextSize = find.byType(TextSizeControl).evaluate().isNotEmpty;

      expect(find.byType(Scaffold), findsOneWidget);
      expect(hasThemeSelector || hasTextSize, isTrue);
    });

    testWidgets('ThemeSelector: tap Sepia if visible', (tester) async {
      final controller = AppThemeController();

      await tester.pumpWidget(
        createTestHarness(
          controller: controller,
          child: const SettingsPage(),
        ),
      );
      await tester.pumpAndSettle();

      final sepia = find.textContaining('Sepia', findRichText: true);
      if (sepia.evaluate().isNotEmpty) {
        await tester.tap(sepia.first);
        await tester.pumpAndSettle();
        expect(controller.visionTheme.toString(), contains('sepia'));
      } else {
        expect(find.byType(Scaffold), findsOneWidget);
      }
    });

    testWidgets('TextSizeControl: tap Normal/Medium/Large if visible', (tester) async {
      final controller = AppThemeController();

      await tester.pumpWidget(
        createTestHarness(
          controller: controller,
          child: const SettingsPage(),
        ),
      );
      await tester.pumpAndSettle();

      final normal = find.textContaining('Normal', findRichText: true);
      final medium = find.textContaining('Medium', findRichText: true);
      final large  = find.textContaining('Large', findRichText: true);

      if (normal.evaluate().isNotEmpty) {
        await tester.tap(normal.first);
        await tester.pumpAndSettle();
      }
      if (medium.evaluate().isNotEmpty) {
        await tester.tap(medium.first);
        await tester.pumpAndSettle();
      }
      if (large.evaluate().isNotEmpty) {
        await tester.tap(large.first);
        await tester.pumpAndSettle();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });
  });
}
'@
Write-FileUtf8NoBom ".\test\pages\settings_interaction_test.dart" $settingsInteraction

# -------------------------------------------------------------------
# test/pages/emergency_interaction_test.dart
# -------------------------------------------------------------------
$emergencyInteraction = @'
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/pages/emergency_page.dart';
import '../helpers/test_harness.dart';

void main() {
  group('EmergencyPage interactions', () {
    testWidgets('Tapping SOS opens confirm sheet and cancel closes it', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      final sos = find.text('SOS');
      expect(sos, findsWidgets);

      await tester.tap(sos.first);
      await tester.pumpAndSettle();

      expect(find.textContaining('Activate Emergency', findRichText: true), findsOneWidget);

      final cancel = find.text('Cancel');
      expect(cancel, findsOneWidget);

      await tester.tap(cancel);
      await tester.pumpAndSettle();

      expect(find.textContaining('Activate Emergency', findRichText: true), findsNothing);
    });

    testWidgets('Confirm shows Emergency Activated banner', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('SOS').first);
      await tester.pumpAndSettle();

      await tester.tap(find.text('Confirm Emergency'));
      await tester.pumpAndSettle();

      expect(find.text('Emergency Activated'), findsOneWidget);
    });

    testWidgets('Phone buttons exist and tapping does not crash', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const EmergencyPage()));
      await tester.pumpAndSettle();

      final phones = find.byIcon(Icons.phone);
      expect(phones, findsWidgets);

      await tester.tap(phones.first);
      await tester.pump();

      expect(find.byType(Scaffold), findsOneWidget);
    });
  });
}
'@
Write-FileUtf8NoBom ".\test\pages\emergency_interaction_test.dart" $emergencyInteraction

# -------------------------------------------------------------------
# test/pages/messages_medications_schedule_test.dart
# -------------------------------------------------------------------
$multiPage = @'
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile_flutter/pages/messages_page.dart';
import 'package:mobile_flutter/pages/medications_page.dart';
import 'package:mobile_flutter/pages/schedule_page.dart';

import '../helpers/test_harness.dart';

void main() {
  group('Messages / Medications / Schedule basic interactions', () {
    testWidgets('MessagesPage builds', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const MessagesPage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
      expect(find.textContaining('Messages', findRichText: true).evaluate().isNotEmpty, isTrue);
    });

    testWidgets('MessagesPage: can type into a TextField if present', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const MessagesPage()));
      await tester.pumpAndSettle();

      final fields = find.byType(TextField);
      if (fields.evaluate().isNotEmpty) {
        await tester.enterText(fields.first, 'Hello');
        await tester.pump();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('MedicationsPage builds and tapping tiles does not crash', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const MedicationsPage()));
      await tester.pumpAndSettle();

      final tiles = find.byType(ListTile);
      if (tiles.evaluate().isNotEmpty) {
        await tester.tap(tiles.first);
        await tester.pump();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('SchedulePage builds', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SchedulePage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('SchedulePage: tapping any buttons does not crash', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SchedulePage()));
      await tester.pumpAndSettle();

      final buttons = find.byType(ElevatedButton);
      if (buttons.evaluate().isNotEmpty) {
        await tester.tap(buttons.first);
        await tester.pump();
      }

      final outlined = find.byType(OutlinedButton);
      if (outlined.evaluate().isNotEmpty) {
        await tester.tap(outlined.first);
        await tester.pump();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });
  });
}
'@
Write-FileUtf8NoBom ".\test\pages\messages_medications_schedule_test.dart" $multiPage

# -------------------------------------------------------------------
# NEW: test/pages/nav_symptoms_checkin_forgot_test.dart
# Adds coverage for:
# - widgets/navigation/bottom_nav.dart
# - pages/symptoms_page.dart
# - pages/patient_checkin_page.dart
# - pages/forgot_password_page.dart
# -------------------------------------------------------------------
$newCoverageFile = @'
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile_flutter/widgets/navigation/bottom_nav.dart';
import 'package:mobile_flutter/pages/symptoms_page.dart';
import 'package:mobile_flutter/pages/patient_checkin_page.dart';
import 'package:mobile_flutter/pages/forgot_password_page.dart';

import '../helpers/test_harness.dart';

void main() {
  group('BottomNav', () {
    testWidgets('Caregiver role shows caregiver menu items', (tester) async {
      await setMockPrefs({'careconnect-role': 'caregiver'});

      String? navigatedTo;
      bool? pushValue;

      await tester.pumpWidget(
        createTestHarness(
          child: BottomNav(
            currentPath: '/caregiver/dashboard',
            onNavigate: (path, {bool push = false}) {
              navigatedTo = path;
              pushValue = push;
            },
          ),
        ),
      );

      // allow async role load
      await tester.pumpAndSettle();

      // Open expanded menu
      await tester.tap(find.text('Menu'));
      await tester.pumpAndSettle();

      expect(find.text('Collapse Menu'), findsOneWidget);
      expect(find.text('Patient List'), findsOneWidget);
      expect(find.text('Schedule'), findsOneWidget);

      // Tap a tile
      await tester.tap(find.text('Patient List'));
      await tester.pumpAndSettle();

      expect(navigatedTo, '/caregiver/patients');
      expect(pushValue, isNotNull);
    });

    testWidgets('Patient role shows patient menu items', (tester) async {
      await setMockPrefs({'careconnect-role': 'patient'});

      await tester.pumpWidget(
        createTestHarness(
          child: BottomNav(
            currentPath: '/patient/dashboard',
            onNavigate: (path, {bool push = false}) {},
          ),
        ),
      );

      await tester.pumpAndSettle();

      await tester.tap(find.text('Menu'));
      await tester.pumpAndSettle();

      expect(find.text('Check-In'), findsOneWidget);
      expect(find.text('Patient List'), findsNothing); // caregiver-only
    });

    testWidgets('Expanded menu can be closed via Collapse Menu', (tester) async {
      await setMockPrefs({'careconnect-role': 'patient'});

      await tester.pumpWidget(
        createTestHarness(
          child: BottomNav(
            currentPath: '/patient/dashboard',
            onNavigate: (path, {bool push = false}) {},
          ),
        ),
      );

      await tester.pumpAndSettle();

      await tester.tap(find.text('Menu'));
      await tester.pumpAndSettle();
      expect(find.text('Collapse Menu'), findsOneWidget);

      await tester.tap(find.text('Collapse Menu'));
      await tester.pumpAndSettle();

      expect(find.text('Collapse Menu'), findsNothing);
    });
  });

  group('SymptomsPage', () {
    testWidgets('SymptomsPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SymptomsPage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
      expect(find.textContaining('Symptoms', findRichText: true).evaluate().isNotEmpty, isTrue);
    });

    testWidgets('Can tap a symptom option if present', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SymptomsPage()));
      await tester.pumpAndSettle();

      // Try tapping one of the known symptom labels from your React version
      final headache = find.text('Headache');
      if (headache.evaluate().isNotEmpty) {
        await tester.tap(headache.first);
        await tester.pump();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('Can interact with slider if present', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SymptomsPage()));
      await tester.pumpAndSettle();

      final sliders = find.byType(Slider);
      if (sliders.evaluate().isNotEmpty) {
        // Drag the first slider a bit
        await tester.drag(sliders.first, const Offset(100, 0));
        await tester.pump();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('Can enter notes if a TextField exists', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SymptomsPage()));
      await tester.pumpAndSettle();

      final fields = find.byType(TextField);
      if (fields.evaluate().isNotEmpty) {
        await tester.enterText(fields.last, 'Feeling slightly dizzy today');
        await tester.pump();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });
  });

  group('PatientCheckInPage', () {
    testWidgets('PatientCheckInPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const PatientCheckInPage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('Check-in page has at least one TextField', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const PatientCheckInPage()));
      await tester.pumpAndSettle();
      expect(find.byType(TextField), findsWidgets);
    });

    testWidgets('Typing into first TextField does not crash', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const PatientCheckInPage()));
      await tester.pumpAndSettle();

      final fields = find.byType(TextField);
      if (fields.evaluate().isNotEmpty) {
        await tester.enterText(fields.first, 'Test input');
        await tester.pump();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('Tapping any ElevatedButton does not crash', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const PatientCheckInPage()));
      await tester.pumpAndSettle();

      final buttons = find.byType(ElevatedButton);
      if (buttons.evaluate().isNotEmpty) {
        await tester.tap(buttons.first);
        await tester.pump();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });
  });

  group('ForgotPasswordPage', () {
    testWidgets('ForgotPasswordPage renders', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const ForgotPasswordPage()));
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('Can type email into TextField if present', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const ForgotPasswordPage()));
      await tester.pumpAndSettle();

      final fields = find.byType(TextField);
      if (fields.evaluate().isNotEmpty) {
        await tester.enterText(fields.first, 'john@doe.com');
        await tester.pump();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('Tapping submit button does not crash', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const ForgotPasswordPage()));
      await tester.pumpAndSettle();

      final elevated = find.byType(ElevatedButton);
      if (elevated.evaluate().isNotEmpty) {
        await tester.tap(elevated.first);
        await tester.pumpAndSettle();
      }

      expect(find.byType(Scaffold), findsOneWidget);
    });
  });
}
'@
Write-FileUtf8NoBom ".\test\pages\nav_symptoms_checkin_forgot_test.dart" $newCoverageFile

# -------------------------------------------------------------------
# test/unit/theme_controller_test.dart
# -------------------------------------------------------------------
$themeUnit = @'
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/theme/app_theme_controller.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('AppThemeController', () {
    test('Default values are sensible', () {
      final c = AppThemeController();
      expect(c.textScaleFactor, 1.0);
      expect(c.visionTheme, AppVisionTheme.defaultTheme);
      expect(c.themeMode, ThemeMode.system);
    });

    test('setVisionTheme updates and notifies', () async {
      SharedPreferences.setMockInitialValues({});
      final c = AppThemeController();

      var notified = false;
      c.addListener(() => notified = true);

      await c.setVisionTheme(AppVisionTheme.sepia);
      expect(c.visionTheme, AppVisionTheme.sepia);
      expect(notified, true);
    });

    test('setTextScale updates and persists', () async {
      SharedPreferences.setMockInitialValues({});
      final c = AppThemeController();

      await c.setTextScale(1.2);
      expect(c.textScaleFactor, 1.2);

      final prefs = await SharedPreferences.getInstance();
      expect(prefs.getDouble('careconnect-textsize'), 1.2);
    });

    test('loadFromPrefs loads stored values', () async {
      SharedPreferences.setMockInitialValues({
        'careconnect-theme': 2, // ThemeMode.dark
        'careconnect-textsize': 1.1,
        'careconnect-vision-theme': 2, // sepia
      });

      final c = AppThemeController();
      await c.loadFromPrefs();

      expect(c.themeMode, ThemeMode.dark);
      expect(c.textScaleFactor, 1.1);
      expect(c.visionTheme, AppVisionTheme.sepia);
    });
  });
}
'@
Write-FileUtf8NoBom ".\test\unit\theme_controller_test.dart" $themeUnit

Write-Host ""
Write-Host "✅ Done creating/overwriting tests in .\test\"
Write-Host "Next run:"
Write-Host "  flutter test --coverage"
Write-Host ""
Write-Host "Then re-run your coverage % script."
