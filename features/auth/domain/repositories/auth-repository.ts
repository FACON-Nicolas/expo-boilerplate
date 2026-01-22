import type { Session, SignInCredentials, SignUpCredentials } from '../entities/session';

export type AuthRepository = {
  signIn: (credentials: SignInCredentials) => Promise<Session>;
  signUp: (credentials: SignUpCredentials) => Promise<Session>;
  signOut: () => Promise<void>;
  refreshSession: (session: Session) => Promise<Session>;
  setSession: (session: Session) => Promise<Session>;
};
