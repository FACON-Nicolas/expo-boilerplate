import { refreshSession } from '@/features/auth/domain/usecases/refresh-session';

import type { Session } from '@/features/auth/domain/entities/session';
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
  signUp: jest.fn(),
  signOut: jest.fn(),
  refreshSession: jest.fn().mockResolvedValue(createMockSession({ accessToken: 'new-access-token' })),
  setSession: jest.fn().mockResolvedValue(createMockSession()),
  getSession: jest.fn().mockResolvedValue(null),
  subscribeToAuthChanges: jest.fn().mockReturnValue(() => {}),
  ...overrides,
});

describe('refreshSession usecase', () => {
  const currentSession = createMockSession();

  it('calls repository.setSession with the current session', async () => {
    const mockRepository = createMockRepository();

    await refreshSession(mockRepository)(currentSession);

    expect(mockRepository.setSession).toHaveBeenCalledWith(currentSession);
    expect(mockRepository.setSession).toHaveBeenCalledTimes(1);
  });

  it('calls repository.refreshSession after setSession', async () => {
    const mockRepository = createMockRepository();

    await refreshSession(mockRepository)(currentSession);

    expect(mockRepository.refreshSession).toHaveBeenCalledWith();
    expect(mockRepository.refreshSession).toHaveBeenCalledTimes(1);
  });

  it('returns the refreshed session from repository', async () => {
    const refreshedSession = createMockSession({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
    const mockRepository = createMockRepository({
      refreshSession: jest.fn().mockResolvedValue(refreshedSession),
    });

    const result = await refreshSession(mockRepository)(currentSession);

    expect(result).toEqual(refreshedSession);
  });

  it('propagates setSession errors', async () => {
    const setSessionError = new Error('Failed to set session');
    const mockRepository = createMockRepository({
      setSession: jest.fn().mockRejectedValue(setSessionError),
    });

    await expect(refreshSession(mockRepository)(currentSession)).rejects.toThrow('Failed to set session');
    expect(mockRepository.refreshSession).not.toHaveBeenCalled();
  });

  it('propagates refreshSession errors', async () => {
    const refreshError = new Error('Session expired');
    const mockRepository = createMockRepository({
      refreshSession: jest.fn().mockRejectedValue(refreshError),
    });

    await expect(refreshSession(mockRepository)(currentSession)).rejects.toThrow('Session expired');
  });
});
