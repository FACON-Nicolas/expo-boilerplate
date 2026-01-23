import { signIn } from '@/features/auth/domain/usecases/sign-in';

import type { Session, SignInCredentials } from '@/features/auth/domain/entities/session';
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

const createMockSession = (overrides?: Partial<Session>): Session => ({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: Date.now() + 3600000,
  user: { id: 'user-123', email: 'test@example.com' },
  ...overrides,
});

const createMockRepository = (overrides?: Partial<AuthRepository>): AuthRepository => ({
  signIn: jest.fn().mockResolvedValue(createMockSession()),
  signUp: jest.fn(),
  signOut: jest.fn(),
  refreshSession: jest.fn(),
  setSession: jest.fn(),
  ...overrides,
});

describe('signIn usecase', () => {
  const validCredentials: SignInCredentials = {
    email: 'test@example.com',
    password: 'Password123!',
  };

  it('calls repository.signIn with validated credentials', async () => {
    const mockRepository = createMockRepository();

    await signIn(mockRepository)(validCredentials);

    expect(mockRepository.signIn).toHaveBeenCalledWith(validCredentials);
    expect(mockRepository.signIn).toHaveBeenCalledTimes(1);
  });

  it('returns the session from repository', async () => {
    const expectedSession = createMockSession();
    const mockRepository = createMockRepository({
      signIn: jest.fn().mockResolvedValue(expectedSession),
    });

    const result = await signIn(mockRepository)(validCredentials);

    expect(result).toEqual(expectedSession);
  });

  it('throws validation error for invalid email format', async () => {
    const mockRepository = createMockRepository();
    const invalidCredentials: SignInCredentials = {
      email: 'invalid-email',
      password: 'Password123!',
    };

    await expect(signIn(mockRepository)(invalidCredentials)).rejects.toThrow();
    expect(mockRepository.signIn).not.toHaveBeenCalled();
  });

  it('calls repository even with empty password (validation is at repository level)', async () => {
    const mockRepository = createMockRepository();
    const credentialsWithEmptyPassword: SignInCredentials = {
      email: 'test@example.com',
      password: '',
    };

    await signIn(mockRepository)(credentialsWithEmptyPassword);

    expect(mockRepository.signIn).toHaveBeenCalledWith(credentialsWithEmptyPassword);
  });

  it('propagates repository errors', async () => {
    const repositoryError = new Error('Network error');
    const mockRepository = createMockRepository({
      signIn: jest.fn().mockRejectedValue(repositoryError),
    });

    await expect(signIn(mockRepository)(validCredentials)).rejects.toThrow('Network error');
  });
});
