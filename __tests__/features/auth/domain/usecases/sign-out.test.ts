import { signOut } from '@/features/auth/domain/usecases/sign-out';

import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

const createMockRepository = (overrides?: Partial<AuthRepository>): AuthRepository => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn().mockResolvedValue(undefined),
  refreshSession: jest.fn(),
  setSession: jest.fn(),
  ...overrides,
});

describe('signOut usecase', () => {
  it('calls repository.signOut', async () => {
    const mockRepository = createMockRepository();

    await signOut(mockRepository)();

    expect(mockRepository.signOut).toHaveBeenCalledTimes(1);
  });

  it('resolves without returning a value', async () => {
    const mockRepository = createMockRepository();

    const result = await signOut(mockRepository)();

    expect(result).toBeUndefined();
  });

  it('propagates repository errors', async () => {
    const repositoryError = new Error('Logout failed');
    const mockRepository = createMockRepository({
      signOut: jest.fn().mockRejectedValue(repositoryError),
    });

    await expect(signOut(mockRepository)()).rejects.toThrow('Logout failed');
  });
});
