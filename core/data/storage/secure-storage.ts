import * as SecureStore from 'expo-secure-store';

const formatKey = (key: string): string => {
  return key.replaceAll(':', '');
};

export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const value = await SecureStore.getItemAsync(formatKey(key));
    return value || null;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(formatKey(key), value);
  },

  removeItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(formatKey(key));
  },
};
