import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import ThemedLink from '@/components/ThemedLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { signIn } from '@/redux/auth';
import { selectAuthState } from '@/redux/auth';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { SignInUser } from '@/types/user';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function Index() {
  const [user, setUser] = useState<SignInUser>({
    email: __DEV__ ? process.env.EXPO_PUBLIC_SUPABASE_EMAIL_LOGIN_DEV! : '',
    password: __DEV__
      ? process.env.EXPO_PUBLIC_SUPABASE_PASSWORD_LOGIN_DEV!
      : '',
  });

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(selectAuthState);

  const onChangeText = (key: keyof SignInUser, value: string) => {
    setUser({ ...user, [key]: value });
  };

  const onPress = async () => {
    try {
      await dispatch(signIn(user)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='subtitle'>{t('auth.login.title')}</ThemedText>
      {error && <ThemedText type='error'>{t(error)}</ThemedText>}
      <ThemedInput
        placeholder={t('auth.common.email')}
        value={user.email}
        onChangeText={(value) => onChangeText('email', value)}
      />
      <ThemedInput
        secureTextEntry
        placeholder={t('auth.common.password')}
        value={user.password}
        onChangeText={(value) => onChangeText('password', value)}
      />
      <ThemedButton onPress={onPress} isLoading={isLoading}>
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
