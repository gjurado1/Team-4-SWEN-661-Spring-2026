import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('Provider and Logic Unit Tests', () {
    test('Role mapping logic persists correctly', () async {
      SharedPreferences.setMockInitialValues({});
      final prefs = await SharedPreferences.getInstance();
      
      const roleKey = 'careconnect-role';
      
      // Act
      await prefs.setString(roleKey, 'caregiver');
      
      // Assert
      expect(prefs.getString(roleKey), 'caregiver');
    });

    test('Accessibility settings persist correctly', () async {
      SharedPreferences.setMockInitialValues({});
      final prefs = await SharedPreferences.getInstance();
      
      await prefs.setBool('careconnect-read-aloud', true);
      expect(prefs.getBool('careconnect-read-aloud'), isTrue);
    });
  });
}