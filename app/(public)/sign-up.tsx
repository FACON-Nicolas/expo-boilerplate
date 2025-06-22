import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import ThemedLink from '@/components/themed-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppSelector } from '@/redux/store';
import { selectAuthState, signUp } from '@/redux/auth';
import { useAppDispatch } from '@/redux/store';
import { SignUpUser } from '@/types/user';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function SignUp() {
  const [user, setUser] = useState<SignUpUser>({
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(selectAuthState);

  const onChangeText = (key: keyof SignUpUser, value: string) => {
    setUser({ ...user, [key]: value });
  };

  const onPress = async () => {
    try {
      await dispatch(signUp(user)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='subtitle'>{t('auth.signUp.title')}</ThemedText>
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
      <ThemedInput
        secureTextEntry
        placeholder={t('auth.signUp.passwordConfirmation')}
        value={user.passwordConfirmation}
        onChangeText={(value) => onChangeText('passwordConfirmation', value)}
      />
      <ThemedButton onPress={onPress} isLoading={isLoading}>
        {t('auth.signUp.button')}
      </ThemedButton>
      <ThemedLink href='/(public)' style={styles.link}>
        {t('auth.signUp.link')}
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
