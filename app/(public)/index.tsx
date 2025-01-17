import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import ThemedLink from '@/components/ThemedLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SignInUser } from '@/types/user';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function Index() {
  const [user, setUser] = useState<SignInUser>({
    email: '',
    password: '',
  });

  const { t } = useTranslation();

  const onChangeText = (key: keyof SignInUser, value: string) => {
    setUser({ ...user, [key]: value });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='subtitle'>{t('auth.login.title')}</ThemedText>
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
      <ThemedButton>{t('auth.login.button')}</ThemedButton>
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
