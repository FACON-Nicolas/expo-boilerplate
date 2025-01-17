import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import ThemedLink from '@/components/ThemedLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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

  const onChangeText = (key: keyof SignUpUser, value: string) => {
    setUser({ ...user, [key]: value });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='subtitle'>{t('auth.signUp.title')}</ThemedText>
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
      <ThemedButton>{t('auth.signUp.button')}</ThemedButton>
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