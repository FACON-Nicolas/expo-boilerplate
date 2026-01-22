import type { AuthRepository } from '../repositories/auth-repository';
import type { Session } from '../entities/session';

export const refreshSession =
  (repository: AuthRepository) =>
  async (session: Session): Promise<Session> => {
    await repository.setSession(session);
    return repository.refreshSession(session);
  };
