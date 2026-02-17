I’ve combined the two versions into one comprehensive, high-quality `README.md`.

I prioritized the professional structure of your first version while integrating the specific pathing (`apps/careconnect_react_native`) and the detailed accessibility feature list from the second student's version. This ensures that Dr. Minagar sees both the technical rigor (coverage stats) and the feature completeness (accessibility list) required for the grade.

---

# CareConnect React Native (Expo) Implementation

**Team 4 | SWEN 661 - Spring 2026** **Instructor: Dr. Minagar**

## 📖 Overview

CareConnect is a cross-platform healthcare mobile application built with React Native (Expo). This project demonstrates feature parity with our previous Flutter implementation while leveraging the React ecosystem for robust, cross-platform healthcare management.

This application supports distinct caregiver and patient roles and was developed with assistance from AI (LLM) to optimize component structure and test coverage.

## 🚀 Features & Parity

All core functionalities from the Flutter application have been successfully ported:

* **Dual-Role Dashboards:** Specific, state-driven interfaces for Caregivers and Patients.
* **Offline Tracking:** Mood Tracking, Symptom Tracking, and Medication Logging (persisted via `AsyncStorage`).
* **Manual Calendar:** Manual entry logging for medical visits and events.
* **Responsive Design:** Optimized layouts for both phone and tablet form factors using custom responsive hooks.

## ♿ Accessibility Features (LO1 Compliance)

CareConnect prioritizes accessibility to satisfy learning objective LO1:

* **Theme Support:** Light, Dark, and System theme switching.
* **Visual Aids:** High contrast mode and reduced motion support.
* **Text Scaling:** Adjustable text size integrated into a custom `ThemeProvider`.
* **Assistive Technology:** Support for screen readers and voice feature toggles.
* **UI Design:** Large touch targets and explicit accessibility roles/labels on all interactive components.

## 🛠 Tech Stack

* **Framework:** React Native (Expo Managed Workflow)
* **Language:** TypeScript
* **Navigation:** React Navigation (Native Stack)
* **State Management:** Zustand
* **Persistence:** `@react-native-async-storage/async-storage`
* **Testing:** Jest & React Native Testing Library (RNTL)

---

## 🏗 Getting Started

### Prerequisites

* **Node.js:** v18 or later
* **npm** or **yarn**
* **Expo Go App:** Installed on your physical device (iOS/Android) for testing.

### Installation & Setup

1. **Clone the Repository:**
```bash
git clone https://github.com/gjurado1/Team-4-SWEN-661-Spring-2026

```


2. **Navigate to the Project Directory:**
```bash
cd apps/careconnect_react_native

```


3. **Install Dependencies:**
```bash
npm install

```


4. **Start the Development Server:**
```bash
npx expo start --web

```


* **Press i** for iOS simulator (Mac)
* **Press a** for Android emulator
* **Scan the QR code** with Expo Go to test on a physical device.



---

## 🧪 Testing & Code Coverage

Team 4 has achieved the required code coverage (min. 60%) using Jest and RNTL.

### Running Tests

To verify the test suite and generate the coverage report:

```bash
npm test -- --coverage

# OR

npx jest --coverage

```

The report is auto-generated and can be viewed at: `coverage/lcov-report/index.html`.

### Running Detox E2E Tests (Android)

Detox tests run against the Android emulator configuration:
- `android.emu.debug`
- AVD name: `Medium_Phone_API_36.1`

1. Start your Android emulator (or let Detox boot it if available in your setup).
2. From `apps/careconnect_react_native`, run:

```bash
npm run detox:android
```

This command starts Metro and runs Detox using your project script at `scripts/detox-android.ps1`.

Alternative split commands:

```bash
npm run detox:build
npm run detox:test
```

If Detox reports no development build installed, run:

```bash
npx expo run:android
```

Then re-run `npm run detox:android`.

### Current Coverage Stats

| Metric | Result | 
| --- | --- |
| **Statements** | **67.23%** |
| **Lines** | **69.13%** |
| **Functions** | **58.94%** |

---

## 📦 Build Instructions

The application is prepared for EAS (Expo Application Services) for production-ready builds.

* **Android (APK):** `npm run build:android` (Generates a preview APK)
* **iOS:** `npm run build:ios`

## 🔐 Security & Quality

* **Static Analysis:** ESLint with `eslint-plugin-security` to detect potential vulnerabilities.
* **Type Safety:** Strict TypeScript configuration (`npm run typecheck`).
* **Dependency Audit:** Regular checks via `npm audit`.

## 📂 Project Structure

```text
src/
├── components/   # Atomic UI components (AppButton, AppCard, etc.)
├── hooks/        # Custom hooks (useAuth, useResponsive)
├── navigation/   # Navigation stacks and type definitions
├── screens/      # Feature screens (SettingsScreen, Dashboards)
├── store/        # Zustand store for global state
├── theme/        # ThemeProvider and accessibility scaling logic
└── utils/        # Storage wrappers and helper functions

```

## 👥 Team 4 Members

* Gary Jurado
* Fon Ade Asa
* Eduardo Estrada

