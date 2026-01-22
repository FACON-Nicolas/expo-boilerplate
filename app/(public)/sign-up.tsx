import { Button } from '@/ui/components/button';
import { Input } from '@/ui/components/input';
import { Link } from '@/ui/components/link';
import { Text } from '@/ui/components/text';
import { View } from '@/ui/components/view';
import { useAuthentication } from '@/features/auth/presentation/hooks/use-authentication';
import type { SignUpCredentials } from '@/features/auth/domain/entities/session';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
  const [user, setUser] = useState<SignUpCredentials>({
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const { t } = useTranslation();
  const { isUserLoading, error, signUp } = useAuthentication();

  const onChangeText = (key: keyof SignUpCredentials, value: string) => {
    setUser({ ...user, [key]: value });
  };

  const onPressSignUp = async () => await signUp(user);

  return (
    <View className="flex-1 justify-center gap-2.5 p-2.5">
      <Text variant='subtitle'>{t('auth.signUp.title')}</Text>
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
      <Input
        secureTextEntry
        placeholder={t('auth.signUp.passwordConfirmation')}
        value={user.passwordConfirmation}
        onChangeText={(value) => onChangeText('passwordConfirmation', value)}
        autoCapitalize='none'
        autoComplete='password'
        keyboardType='visible-password'
      />
      <Button onPress={onPressSignUp} isLoading={isUserLoading}>
        {t('auth.signUp.button')}
      </Button>
      <Link href='/(public)' className="text-center">
        {t('auth.signUp.link')}
      </Link>
    </View>
  );
}
