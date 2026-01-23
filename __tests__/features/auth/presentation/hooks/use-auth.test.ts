import { act, renderHook } from '@testing-library/react-native';

import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { useAuthStore } from '@/features/auth/presentation/store/auth-store';

jest.mock('@/features/auth/domain/usecases/sign-in', () => ({
  signIn: () => jest.fn(),
}));

jest.mock('@/features/auth/domain/usecases/sign-up', () => ({
  signUp: () => jest.fn(),
}));

jest.mock('@/features/auth/domain/usecases/refresh-session', () => ({
  refreshSession: () => jest.fn(),
}));

jest.mock('@/features/auth/data/repositories/supabase-auth-repository', () => ({
  createSupabaseAuthRepository: jest.fn(() => ({})),
}));

jest.mock('@/infrastructure/supabase/client', () => ({
  supabaseClient: {},
}));

jest.mock('@/core/data/storage/secure-storage', () => ({
  secureStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: false,
      error: null,
    });
  });

  it('returns the full auth store state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('session');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('signIn');
    expect(result.current).toHaveProperty('signUp');
    expect(result.current).toHaveProperty('signOut');
    expect(result.current).toHaveProperty('setError');
    expect(result.current).toHaveProperty('refreshAndSetSession');
  });

  it('reflects store state changes', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();

    act(() => {
      useAuthStore.setState({
        user: { id: 'user-123', email: 'test@example.com' },
      });
    });

    expect(result.current.user).toEqual({ id: 'user-123', email: 'test@example.com' });
  });
});
