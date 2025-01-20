import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice, { setSupabaseSessionAndRefresh } from './auth';
import { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Persistor } from 'redux-persist/es/types';
import { persistReducer, persistStore } from 'redux-persist';
import * as SecureStore from 'expo-secure-store';

const formatKey = (key: string) => {
  return key.replaceAll(':', '');
};

const secureStorage = {
  getItem: async (key: string) => {
    const value = await SecureStore.getItemAsync(formatKey(key));
    return value || null;
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(formatKey(key), value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(formatKey(key));
  },
};
const persistConfig = {
  key: 'root',
  storage: secureStorage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor: Persistor = persistStore(store);

export const getSessionFromStore = async () => {
  try {
    const session = store.getState().auth.session;
    if (!session) {
      return;
    }

    store.dispatch(setSupabaseSessionAndRefresh(session));
  } catch (error) {
    return Promise.reject(error);
  }
};

persistor.subscribe(() => {
  getSessionFromStore();
});

export default store;
