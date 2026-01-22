import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import ThemedLink from '@/components/themed-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthentication } from '@/features/auth/presentation/hooks/use-authentication';
import type { SignInCredentials } from '@/features/auth/domain/entities/session';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function Index() {
  const [user, setUser] = useState<SignInCredentials>({
    email: __DEV__ ? process.env.EXPO_PUBLIC_SUPABASE_EMAIL_LOGIN_DEV! : '',
    password: __DEV__
      ? process.env.EXPO_PUBLIC_SUPABASE_PASSWORD_LOGIN_DEV!
      : '',
  });

  const { t } = useTranslation();
  const { isUserLoading, error, signIn } = useAuthentication();

  const onChangeText = (key: keyof SignInCredentials, value: string) => {
    setUser({ ...user, [key]: value });
  };

  const onPress = async () => await signIn(user);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='subtitle'>{t('auth.login.title')}</ThemedText>
      {error && <ThemedText type='error'>{t(error)}</ThemedText>}
      <ThemedInput
        placeholder={t('auth.common.email')}
        value={user.email}
        onChangeText={(value) => onChangeText('email', value)}
        autoCapitalize='none'
        autoComplete='email'
        keyboardType='email-address'
      />
      <ThemedInput
        secureTextEntry
        placeholder={t('auth.common.password')}
        value={user.password}
        onChangeText={(value) => onChangeText('password', value)}
        autoCapitalize='none'
        autoComplete='password'
        keyboardType='visible-password'
      />
      <ThemedButton onPress={onPress} isLoading={isUserLoading}>
        {t('auth.login.button')}
      </ThemedButton>
      <ThemedLink href='/(public)/sign-up' style={styles.link}>
        {t('auth.login.link')}
      </ThemedLink>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
    padding: 10,
  },
  link: {
    textAlign: 'center',
  },
});
