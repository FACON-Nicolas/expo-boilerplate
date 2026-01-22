import { ThemedTabBarIcon } from '@/components/themed-tab-bar-icon';
import { useThemeColor } from '@/core/presentation/hooks/use-theme-color';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function RootLayout() {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: false,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: tintColor,
        },
      }}
    >
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
