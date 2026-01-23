import { signUp } from '@/features/auth/domain/usecases/sign-up';

import type { Session, SignUpCredentials } from '@/features/auth/domain/entities/session';
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

const createMockSession = (overrides?: Partial<Session>): Session => ({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: Date.now() + 3600000,
  user: { id: 'user-123', email: 'test@example.com' },
  ...overrides,
});

const createMockRepository = (overrides?: Partial<AuthRepository>): AuthRepository => ({
  signIn: jest.fn(),
  signUp: jest.fn().mockResolvedValue(createMockSession()),
  signOut: jest.fn(),
  refreshSession: jest.fn(),
  setSession: jest.fn(),
  ...overrides,
});

describe('signUp usecase', () => {
  const validCredentials: SignUpCredentials = {
    email: 'newuser@example.com',
    password: 'Password123!',
    passwordConfirmation: 'Password123!',
  };

  it('calls repository.signUp with validated credentials', async () => {
    const mockRepository = createMockRepository();

    await signUp(mockRepository)(validCredentials);

    expect(mockRepository.signUp).toHaveBeenCalledWith(validCredentials);
    expect(mockRepository.signUp).toHaveBeenCalledTimes(1);
  });

  it('returns the session from repository', async () => {
    const expectedSession = createMockSession({ user: { id: 'new-user', email: 'newuser@example.com' } });
    const mockRepository = createMockRepository({
      signUp: jest.fn().mockResolvedValue(expectedSession),
    });

    const result = await signUp(mockRepository)(validCredentials);

    expect(result).toEqual(expectedSession);
  });

  it('throws validation error for invalid email format', async () => {
    const mockRepository = createMockRepository();
    const invalidCredentials: SignUpCredentials = {
      email: 'invalid-email',
      password: 'Password123!',
      passwordConfirmation: 'Password123!',
    };

    await expect(signUp(mockRepository)(invalidCredentials)).rejects.toThrow();
    expect(mockRepository.signUp).not.toHaveBeenCalled();
  });

  it('throws validation error for password mismatch', async () => {
    const mockRepository = createMockRepository();
    const invalidCredentials: SignUpCredentials = {
      email: 'test@example.com',
      password: 'Password123!',
      passwordConfirmation: 'DifferentPassword123!',
    };

    await expect(signUp(mockRepository)(invalidCredentials)).rejects.toThrow();
    expect(mockRepository.signUp).not.toHaveBeenCalled();
  });

  it('throws validation error for weak password', async () => {
    const mockRepository = createMockRepository();
    const invalidCredentials: SignUpCredentials = {
      email: 'test@example.com',
      password: '123',
      passwordConfirmation: '123',
    };

    await expect(signUp(mockRepository)(invalidCredentials)).rejects.toThrow();
    expect(mockRepository.signUp).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    const repositoryError = new Error('User already exists');
    const mockRepository = createMockRepository({
      signUp: jest.fn().mockRejectedValue(repositoryError),
    });

    await expect(signUp(mockRepository)(validCredentials)).rejects.toThrow('User already exists');
  });
});
