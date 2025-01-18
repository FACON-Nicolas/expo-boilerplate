import { ThemedTabBarIcon } from '@/components/ThemedTabBarIcon';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function RootLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name='index'
        options={{
          title: t('tabs.home'),
          tabBarIcon: (props) => <ThemedTabBarIcon name='home' {...props} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: t('tabs.profile'),
          tabBarIcon: (props) => <ThemedTabBarIcon name='person' {...props} />,
        }}
      />
    </Tabs>
  );
}
