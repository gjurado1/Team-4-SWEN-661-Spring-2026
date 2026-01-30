import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_flutter/providers/auth_provider.dart';

void main() {
  test('User logs in successfully', () {
    final container = ProviderContainer();
    final notifier =
        container.read(authProvider.notifier);

    notifier.login();

    final state = container.read(authProvider);
    expect(state.isLoggedIn, true);
  });
}
