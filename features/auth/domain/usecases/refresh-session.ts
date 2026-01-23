import type { Session } from '@/features/auth/domain/entities/session';
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

export const refreshSession =
  (repository: AuthRepository) =>
  async (session: Session): Promise<Session> => {
    await repository.setSession(session);
    return repository.refreshSession(session);
  };
