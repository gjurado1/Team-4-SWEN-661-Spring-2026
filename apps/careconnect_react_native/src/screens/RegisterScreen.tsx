import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/ui/AppCard';
import { AppInput } from '../components/ui/AppInput';
import { AppButton } from '../components/ui/AppButton';
import { AppAlert } from '../components/ui/AppAlert';
import { PageHeader } from '../components/ui/PageHeader';
import { createUser } from '../services/database';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  const onSubmit = React.useCallback(async () => {
    setError(null);
    setOk(null);
    const u = username.trim();
    const p = password.trim();
    const c = confirm.trim();
    if (!u || !p) {
      setError('Please enter a username and password.');
      return;
    }
    if (p.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (p !== c) {
      setError('Passwords do not match.');
      return;
    }

    await createUser({ username: u, password: p });
    setOk('Account created. You can now sign in.');
    setUsername('');
    setPassword('');
    setConfirm('');
  }, [confirm, password, username]);

  return (
    <ScreenContainer scroll testID="register-screen">
      <View style={{ maxWidth: 520, width: '100%', alignSelf: 'center', gap: 16 }}>
        <PageHeader title="Create account" subtitle="Create a new CareConnect account" />

        <AppCard>
          <View style={{ gap: 12 }}>
            <AppInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              testID="register-username"
            />
            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Choose a password"
              secureTextEntry
              testID="register-password"
            />
            <AppInput
              label="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Re-enter password"
              secureTextEntry
              onSubmitEditing={onSubmit}
              testID="register-confirm-password"
            />

            {error ? <AppAlert variant="error" message={error} /> : null}
            {ok ? <AppAlert variant="success" message={ok} /> : null}

            <AppButton title="Create Account" onPress={onSubmit} expand />
            <AppButton title="Back to Login" variant="secondary" onPress={() => navigation.navigate('Login')} expand />
          </View>
        </AppCard>
      </View>
    </ScreenContainer>
  );
}
