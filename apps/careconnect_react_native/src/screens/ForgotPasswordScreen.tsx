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

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const onSend = React.useCallback(async () => {
    setSent(true);
  }, []);

  return (
    <ScreenContainer scroll testID="forgot-password-screen">
      <View style={{ maxWidth: 520, width: '100%', alignSelf: 'center', gap: 16 }}>
        <PageHeader title="Forgot password" subtitle="We'll send you a reset link" />

        <AppCard>
          <View style={{ gap: 12 }}>
            <AppInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={onSend}
              testID="forgot-password-email"
            />

            {sent ? (
              <AppAlert variant="info" message="Password reset link sent! Please check your inbox." />
            ) : null}

            <AppButton title="Send reset link" onPress={onSend} expand />
            <AppButton title="Back to Login" variant="secondary" onPress={() => navigation.navigate('Login')} expand />
          </View>
        </AppCard>
      </View>
    </ScreenContainer>
  );
}
