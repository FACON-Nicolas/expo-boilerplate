import { act, renderHook } from '@testing-library/react-native';

import { useAuthentication } from '@/features/auth/presentation/hooks/use-authentication';

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
let mockUser: { id: string; email: string } | null = null;

jest.mock('@/features/auth/presentation/hooks/use-auth', () => ({
  useAuth: () => ({
    user: mockUser,
    isLoading: false,
    signIn: mockSignIn,
    signUp: mockSignUp,
  }),
}));

describe('useAuthentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockReset();
    mockSignUp.mockReset();
    mockUser = null;
  });

  describe('initial state', () => {
    it('returns correct initial state', () => {
      const { result } = renderHook(() => useAuthentication());

      expect(result.current.isUserAuthenticated).toBe(false);
      expect(result.current.isUserLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('signIn', () => {
    it('calls store signIn with credentials', async () => {
      mockSignIn.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthentication());

      await act(async () => {
        await result.current.signIn({ email: 'test@example.com', password: 'password' });
      });

      expect(mockSignIn).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    });

    it('clears error before signIn attempt', async () => {
      mockSignIn.mockRejectedValueOnce(new Error('First error'));
      mockSignIn.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuthentication());

      await act(async () => {
        await result.current.signIn({ email: 'test@example.com', password: 'wrong' });
      });

      expect(result.current.error).toBe('First error');

      await act(async () => {
        await result.current.signIn({ email: 'test@example.com', password: 'correct' });
      });

      expect(result.current.error).toBeNull();
    });

    it('sets error on signIn failure', async () => {
      mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuthentication());

      await act(async () => {
        await result.current.signIn({ email: 'test@example.com', password: 'wrong' });
      });

      expect(result.current.error).toBe('Invalid credentials');
    });

    it('sets generic error for non-Error exceptions', async () => {
      mockSignIn.mockRejectedValue('string error');

      const { result } = renderHook(() => useAuthentication());

      await act(async () => {
        await result.current.signIn({ email: 'test@example.com', password: 'wrong' });
      });

      expect(result.current.error).toBe('An error occurred');
    });
  });

  describe('signUp', () => {
    it('calls store signUp with credentials', async () => {
      mockSignUp.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthentication());

      await act(async () => {
        await result.current.signUp({
          email: 'new@example.com',
          password: 'Password123!',
          passwordConfirmation: 'Password123!',
        });
      });

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
      });
    });

    it('sets error on signUp failure', async () => {
      mockSignUp.mockRejectedValue(new Error('User already exists'));

      const { result } = renderHook(() => useAuthentication());

      await act(async () => {
        await result.current.signUp({
          email: 'existing@example.com',
          password: 'Password123!',
          passwordConfirmation: 'Password123!',
        });
      });

      expect(result.current.error).toBe('User already exists');
    });
  });

  describe('isUserAuthenticated', () => {
    it('returns true when user exists', () => {
      mockUser = { id: 'user-123', email: 'test@example.com' };

      const { result } = renderHook(() => useAuthentication());

      expect(result.current.isUserAuthenticated).toBe(true);
    });

    it('returns false when user is null', () => {
      mockUser = null;

      const { result } = renderHook(() => useAuthentication());

      expect(result.current.isUserAuthenticated).toBe(false);
    });
  });
});
