import { act, renderHook } from '@testing-library/react-native';

import { useAuthStore } from '@/features/auth/presentation/store/auth-store';

import type { Session } from '@/features/auth/domain/entities/session';

const mockSignInUsecase = jest.fn();
const mockSignUpUsecase = jest.fn();
const mockRefreshSessionUsecase = jest.fn();

jest.mock('@/features/auth/domain/usecases/sign-in', () => ({
  signIn: () => mockSignInUsecase,
}));

jest.mock('@/features/auth/domain/usecases/sign-up', () => ({
  signUp: () => mockSignUpUsecase,
}));

jest.mock('@/features/auth/domain/usecases/refresh-session', () => ({
  refreshSession: () => mockRefreshSessionUsecase,
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

const createMockSession = (overrides?: Partial<Session>): Session => ({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: Date.now() + 3600000,
  user: { id: 'user-123', email: 'test@example.com' },
  ...overrides,
});

describe('auth-store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('has null user and session', () => {
      const { result } = renderHook(() => useAuthStore((state) => state));

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('signIn', () => {
    it('sets isLoading to true while signing in', async () => {
      const mockSession = createMockSession();
      let resolvePromise: (value: Session) => void;
      const pendingPromise = new Promise<Session>((resolve) => {
        resolvePromise = resolve;
      });
      mockSignInUsecase.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => useAuthStore((state) => state));

      act(() => {
        result.current.signIn({ email: 'test@example.com', password: 'password' });
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!(mockSession);
        await pendingPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('sets user and session on successful sign in', async () => {
      const mockSession = createMockSession();
      mockSignInUsecase.mockResolvedValue(mockSession);

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.signIn({ email: 'test@example.com', password: 'password' });
      });

      expect(result.current.user).toEqual(mockSession.user);
      expect(result.current.session).toEqual(mockSession);
      expect(result.current.error).toBeNull();
    });

    it('sets error on failed sign in', async () => {
      mockSignInUsecase.mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        try {
          await result.current.signIn({ email: 'test@example.com', password: 'wrong' });
        } catch {
          // expected
        }
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.error).toBe('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('sets user and session on successful sign up', async () => {
      const mockSession = createMockSession({ user: { id: 'new-user', email: 'new@example.com' } });
      mockSignUpUsecase.mockResolvedValue(mockSession);

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.signUp({
          email: 'new@example.com',
          password: 'Password123!',
          passwordConfirmation: 'Password123!',
        });
      });

      expect(result.current.user).toEqual(mockSession.user);
      expect(result.current.session).toEqual(mockSession);
    });

    it('sets error on failed sign up', async () => {
      mockSignUpUsecase.mockRejectedValue(new Error('User already exists'));

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        try {
          await result.current.signUp({
            email: 'existing@example.com',
            password: 'Password123!',
            passwordConfirmation: 'Password123!',
          });
        } catch {
          // expected
        }
      });

      expect(result.current.error).toBe('User already exists');
    });
  });

  describe('signOut', () => {
    it('clears user and session', async () => {
      useAuthStore.setState({
        user: { id: 'user-123', email: 'test@example.com' },
        session: createMockSession(),
      });

      const { result } = renderHook(() => useAuthStore((state) => state));

      act(() => {
        result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('setError', () => {
    it('sets the error state', () => {
      const { result } = renderHook(() => useAuthStore((state) => state));

      act(() => {
        result.current.setError('Custom error message');
      });

      expect(result.current.error).toBe('Custom error message');
    });

    it('clears the error when set to null', () => {
      useAuthStore.setState({ error: 'Previous error' });

      const { result } = renderHook(() => useAuthStore((state) => state));

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('refreshAndSetSession', () => {
    it('updates session with refreshed data', async () => {
      const currentSession = createMockSession();
      const refreshedSession = createMockSession({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      mockRefreshSessionUsecase.mockResolvedValue(refreshedSession);

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.refreshAndSetSession(currentSession);
      });

      expect(result.current.session).toEqual(refreshedSession);
      expect(result.current.user).toEqual(refreshedSession.user);
    });

    it('sets error on refresh failure', async () => {
      const currentSession = createMockSession();
      mockRefreshSessionUsecase.mockRejectedValue(new Error('Session expired'));

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        try {
          await result.current.refreshAndSetSession(currentSession);
        } catch {
          // expected
        }
      });

      expect(result.current.error).toBe('Session expired');
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });
  });
});
