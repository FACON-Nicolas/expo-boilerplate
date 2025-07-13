import { ThemedInput } from '@/components/themed-input';
import ThemedSafeAreaView from '@/components/themed-safe-area-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { CreateProfile } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import { useCreateProfile } from '@/hooks/queries/useCreateProfile';
import { useAuth } from '@/store/auth';

export default function Onboarding() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<CreateProfile>({
    firstname: '',
    lastname: '',
  });

  const onProfileFieldChange = (field: keyof CreateProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const { mutate: createProfile, isPending } = useCreateProfile();

  const onPress = async () => {
    await createProfile({ profile, userId: user?.id ?? '' });
  };

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.form}>
          <ThemedText type='title' style={styles.title}>
            {t('onboarding.title')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('onboarding.subtitle')}
          </ThemedText>
          <ThemedView style={styles.inputs}>
            <ThemedInput
              value={profile.firstname}
              placeholder={t('onboarding.firstname')}
              autoCorrect={false}
              onChangeText={(value) => onProfileFieldChange('firstname', value)}
            />
            <ThemedInput
              value={profile.lastname}
              placeholder={t('onboarding.lastname')}
              autoCorrect={false}
              onChangeText={(value) => onProfileFieldChange('lastname', value)}
            />
          </ThemedView>
        </ThemedView>
        <ThemedButton onPress={onPress} isLoading={isPending}>
          <ThemedText>{t('onboarding.next')}</ThemedText>
        </ThemedButton>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
    justifyContent: 'space-between',
  },
  form: {
    gap: 20,
  },
  inputs: {
    gap: 10,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
