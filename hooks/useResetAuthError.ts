import { setAuthError } from '@/redux/auth';
import { useAppDispatch } from '@/redux/store';
import { useSegments } from 'expo-router';
import { useEffect } from 'react';

export function useResetAuthError() {
  const dispatch = useAppDispatch();
  const segments = useSegments();

  useEffect(() => {
    dispatch(setAuthError(null));
  }, [segments, dispatch]);
}
