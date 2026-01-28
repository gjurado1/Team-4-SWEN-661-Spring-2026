class AuthState {
  final bool isLoggedIn;

  AuthState({required this.isLoggedIn});

  AuthState copyWith({bool? isLoggedIn}) {
    return AuthState(
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
    );
  }
}
