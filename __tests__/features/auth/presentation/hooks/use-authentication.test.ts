import { act, renderHook } from '@testing-library/react-native';

import { AppError } from '@/core/domain/errors/app-error';
import { useAuthentication } from '@/features/auth/presentation/hooks/use-authentication';

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockClearError = jest.fn();
let mockUser: { id: string; email: string } | null = null;
let mockError: AppError | null = null;

jest.mock('@/features/auth/presentation/hooks/use-auth', () => ({
  useAuth: () => ({
    user: mockUser,
    isLoading: false,
    error: mockError,
    signIn: mockSignIn,
    signUp: mockSignUp,
    clearError: mockClearError,
  }),
}));

describe('useAuthentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockReset();
    mockSignUp.mockReset();
    mockClearError.mockReset();
    mockUser = null;
    mockError = null;
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

    it('calls clearError before signIn attempt', async () => {
      mockSignIn.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthentication());

      await act(async () => {
        await result.current.signIn({ email: 'test@example.com', password: 'password' });
      });

      expect(mockClearError).toHaveBeenCalled();
    });

    it('returns error from store', () => {
      mockError = AppError.unauthorized('Invalid credentials');

      const { result } = renderHook(() => useAuthentication());

      expect(result.current.error).toBeInstanceOf(AppError);
      expect(result.current.error?.message).toBe('Invalid credentials');
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

    it('calls clearError before signUp attempt', async () => {
      mockSignUp.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthentication());

      await act(async () => {
        await result.current.signUp({
          email: 'new@example.com',
          password: 'Password123!',
          passwordConfirmation: 'Password123!',
        });
      });

      expect(mockClearError).toHaveBeenCalled();
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
