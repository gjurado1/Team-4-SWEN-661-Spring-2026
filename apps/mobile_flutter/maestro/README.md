# Maestro E2E Tests for CareConnect Mobile

This directory contains end-to-end tests for the CareConnect mobile Flutter application using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

1. **Install Maestro CLI:**
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   export PATH="$HOME/.maestro/bin:$PATH"
   ```

2. **Build and install the Flutter app:**
   ```bash
   cd apps/mobile_flutter
   flutter run  # This installs the app on your device/simulator
   ```

3. **App ID is hardcoded:**
   All test files use `appId: com.example.mobileFlutter` directly. If your bundle ID is different, edit the `appId` line in each test file.

## Running Tests

### Run Individual Tests

```bash
maestro test maestro/01-authentication-flow.yaml
maestro test maestro/02-patient-checkin-flow.yaml
maestro test maestro/03-caregiver-navigation-flow.yaml
maestro test maestro/04-registration-flow.yaml
maestro test maestro/05-emergency-access-flow.yaml
```

### Run All Tests

```bash
maestro test maestro/
```

### Run with Debug Output

```bash
maestro test maestro/01-authentication-flow.yaml --debug
```

## Test Files

### 01-authentication-flow.yaml
Tests the complete authentication flow:
- Login with patient credentials (`testpatient` / `password123`)
- Login with caregiver credentials (`demo` / `password123`)
- Invalid credentials handling
- Navigation to appropriate dashboards

### 02-patient-checkin-flow.yaml
Tests the patient check-in process:
- Mood selection (multiple moods tested)
- Symptom/note entry
- Check-in submission
- Multiple check-in scenarios

### 03-caregiver-navigation-flow.yaml
Tests caregiver navigation:
- Dashboard elements verification
- Patient list access
- Schedule viewing
- Messages, Profile, Settings navigation
- Emergency access

### 04-registration-flow.yaml
Tests the complete registration flow:
- Role selection (Patient/Caregiver)
- Personal information entry
- Contact information entry
- Preferences setup
- Review and completion

### 05-emergency-access-flow.yaml
Tests emergency access functionality:
- Emergency access from patient dashboard
- Emergency access from caregiver dashboard
- Emergency access from different screens
- Quick access verification

## Test Credentials

The tests use the following demo credentials:
- **Patient**: `testpatient` / `password123`
- **Caregiver**: `demo` / `password123`
- **Default Admin**: `admin` / `password123`

Alternatively, tests can use the demo login buttons on the login screen (👤 Patient Account, 👨‍⚕️ Caregiver Account).

## Troubleshooting

### Issue: Tests timeout or hang

1. **Check device is connected:**
   ```bash
   maestro device list
   ```

2. **Ensure app is running:**
   ```bash
   flutter run
   ```
   Keep this running in one terminal, run Maestro in another.

3. **Use debug mode:**
   ```bash
   maestro test maestro/01-authentication-flow.yaml --debug
   ```

### Issue: "Element not found"

- UI text might have changed - update selectors in test files
- Use `maestro studio` to inspect available selectors
- Check for typos or case sensitivity in text matches

### Issue: "App not found"

- Verify bundle ID matches: `grep PRODUCT_BUNDLE_IDENTIFIER ios/Runner.xcodeproj/project.pbxproj`
- Ensure app is installed: `flutter install`
- If your bundle ID is different from `com.example.mobileFlutter`, edit the `appId` in each test file

## Notes

- Tests assume the app starts from a clean state (logged out)
- Some tests may require the app to be reset between runs
- Adjust selectors/text matchers if UI text changes
- For iOS, the bundle ID is `com.example.mobileFlutter`
- Maestro logs are saved in `debug/.maestro/tests/` directory
