# CareConnect – Mobile Flutter Application



## Project Description

**CareConnect Mobile** is a Flutter-based mobile application designed to support caregivers and patients in environments where connectivity may be unreliable. The app focuses on usability, accessibility, and offline-first functionality to ensure critical information remains available at all times.

This project fulfills **Part 1: Flutter Application (60% of assignment grade)** by delivering a complete, production-ready mobile application with robust navigation, state management, accessibility features, and local data persistence.

### 🔹 Core Functionality

The application implements **14 fully functional screens**, including:

* Caregiver Dashboard
* Patient Dashboard
* Patient List
* Patient Check-In
* Medications
* Symptoms
* Reports
* Schedule
* Messages
* Emergency
* Profile
* Settings
* Login / Register / Forgot Password

Navigation is implemented using **GoRouter (Navigator 2.0)**, and state management is handled using **Riverpod**, following Flutter best practices.

### 🔹 Offline Data Persistence

CareConnect Mobile supports **offline persistence** to ensure continuity of care when network access is unavailable. The app uses:

* **SQLite** for structured local data storage
* **SharedPreferences** for lightweight configuration and user settings

This allows patient data, settings, and app state to remain accessible even without an active internet connection.

### 🔹 Accessibility & Usability

Accessibility is a core design goal of the application. CareConnect Mobile includes:

* **Low-vision accessibility settings**
* **Multiple themes**:

  * Light
  * Dark
  * Sepia
* **Adjustable text scaling**:

  * 100%
  * 150%
  * 200%
* Semantic widgets applied to all interactive UI elements to support screen readers

The UI is responsive and optimized for both **phone and tablet screen sizes**.

### 🔹 Code Quality & Build Requirements

The project emphasizes clean, maintainable code and follows Flutter standards:

* Clear separation of screens, widgets, models, and services
* Meaningful variable and function naming
* Inline comments for complex logic
* Consistent code style (`flutter analyze` runs with no errors)
* No compiler warnings
* Static analysis tools used to scan for potential security issues

The application successfully builds on supported platforms:

* **Android**: `flutter build apk`
* **iOS** (macOS only): `flutter build ios`

Build artifacts are included with the submission.

---

## ▶️ How to Run the App

### Prerequisites

* Flutter SDK (>= 3.4.0)
* Chrome (for web demo)
* Android Emulator / physical device

### Steps

```bash
git clone https://github.com/gjurado1/Team-4-SWEN-661-Spring-2026.git
cd Team-4-SWEN-661-Spring-2026
flutter pub get
flutter run 
```

To run specifically in Chrome:

```bash
flutter run -d chrome
```

To run on an Android emulator
```bash
flutter run -d <YOUR-EMULATOR-HERE>
```
> **Note:** SQLite is used for mobile platforms. 

---

## 🧪 How to Run Tests

Run all unit and widget tests:

```bash
flutter test
```

Generate test coverage:

```bash
flutter test --coverage
```

Generate HTML coverage report:

```bash
genhtml coverage/lcov.info -o coverage/html
```

Open the coverage report:

```bash
open coverage/html/index.html
```

---

## Test Coverage Report

The generated coverage report is included in the repository under:

```
coverage/html/index.html
```

Current coverage is 75.4 %. The project meets the **minimum 60% test coverage requirement** as specified in the assignment.

---

## ⚠️ Known Issues or Limitations

* SQLite is not supported on Flutter Web.
* Passwords are stored in plaintext for demonstration purposes only and are not encrypted.
* UI styling is functional but not fully implemented.
* Some advanced features (e.g., role-based dashboards, remote sync) are outside the current scope.

---

## 👥 Team Member Contributions (This Week)

The following contributions were made by each team member during the current development iteration:

* **Gary Jurado**

  * Implemented all primary **UI screens and layouts** across the application
  * Ensured responsive design for both phone and tablet form factors
  * Applied consistent styling, theming, and accessibility considerations throughout the UI

* **Fon Ade Asa'A**

  * Designed and implemented **unit testing modules**
  * Created widget and logic tests to validate core application behavior
  * Assisted with test structure organization and test coverage verification

* **Eduardo Estrada**

  * Implemented **SQLite-based local data persistence**
  * Designed database schema and data access logic for offline functionality
  * Integrated local storage with application state management to support offline use cases

---

## 🤖 AI Usage Summary

Artificial Intelligence tools were used as a **development aid** throughout the project to improve productivity and code quality. Specifically, AI was used to:

* Generate **boilerplate code examples** for Flutter widgets, SQLite helpers, and Riverpod patterns
* Assist with **debugging errors**, resolving dependency conflicts, and improving test reliability
* Help draft and refine **documentation**, including the README and technical descriptions
* Provide guidance on **best practices** for Flutter architecture, testing strategies, and accessibility implementation

All AI-generated content was **reviewed, modified, and validated by the team** before being integrated into the project. Final implementation decisions, code structure, and testing outcomes remain the responsibility of the development team.

---


## ✅ Summary

This project demonstrates:

* Offline-first mobile application design
* Local data persistence with SQLite
* State management using Riverpod
* Flutter testing and (LCOV) coverage reporting
* Clear documentation and reproducible builds

---
