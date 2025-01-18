import { ThemedTabBarIcon } from '@/components/ThemedTabBarIcon';
import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: (props) => <ThemedTabBarIcon name='home' {...props} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: (props) => <ThemedTabBarIcon name='person' {...props} />,
        }}
      />
    </Tabs>
  );
}
