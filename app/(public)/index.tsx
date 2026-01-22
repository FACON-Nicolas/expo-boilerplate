import { Button } from '@/ui/components/button';
import { Input } from '@/ui/components/input';
import { Link } from '@/ui/components/link';
import { Text } from '@/ui/components/text';
import { View } from '@/ui/components/view';
import { useAuthentication } from '@/features/auth/presentation/hooks/use-authentication';
import type { SignInCredentials } from '@/features/auth/domain/entities/session';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const onPressSignIn = async () => await signIn(user);

  return (
    <View className="flex-1 justify-center gap-2.5 p-2.5">
      <Text variant='subtitle'>{t('auth.login.title')}</Text>
      {error && <Text variant='error'>{t(error)}</Text>}
      <Input
        placeholder={t('auth.common.email')}
        value={user.email}
        onChangeText={(value) => onChangeText('email', value)}
        autoCapitalize='none'
        autoComplete='email'
        keyboardType='email-address'
      />
      <Input
        secureTextEntry
        placeholder={t('auth.common.password')}
        value={user.password}
        onChangeText={(value) => onChangeText('password', value)}
        autoCapitalize='none'
        autoComplete='password'
        keyboardType='visible-password'
      />
      <Button onPress={onPressSignIn} isLoading={isUserLoading}>
        {t('auth.login.button')}
      </Button>
      <Link href='/(public)/sign-up' className="text-center">
        {t('auth.login.link')}
      </Link>
    </View>
  );
}
