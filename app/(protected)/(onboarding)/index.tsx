import { StyleSheet } from 'react-native';
import React from 'react';
import ThemedSafeAreaView from '@/components/themed-safe-area-view';
import { ThemedText } from '@/components/themed-text';
import LottieView from 'lottie-react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const onButtonPress = () => router.replace('/identity');
  const { t } = useTranslation();

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <LottieView
          source={require('@/assets/animations/start-onboarding.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        <ThemedText type='title' style={styles.title}>
          {t('onboarding.welcome.title')}
        </ThemedText>
        <ThemedText style={styles.body}>
          {t('onboarding.welcome.body')}
        </ThemedText>
        <ThemedText style={[styles.body, { fontSize: 14, opacity: 0.8 }]}>
          {t('onboarding.welcome.ps')}
        </ThemedText>
      </ThemedView>
      <ThemedButton onPress={onButtonPress}>
        {t('onboarding.welcome.button')}
      </ThemedButton>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    gap: 24,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    textAlign: 'center',
    lineHeight: 28,
  },
  body: {
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: 'auto',
  },
});
