import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import '@/i18n';
import { Provider } from 'react-redux';
import store, { persistor } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName='(public)'
          >
            <Stack.Screen name='(public)' />
            <Stack.Screen name='(protected)' />
          </Stack>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
