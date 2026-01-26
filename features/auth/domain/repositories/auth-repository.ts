import type { Session, SignInCredentials, SignUpCredentials } from '@/features/auth/domain/entities/session';

export type AuthStateCallback = (session: Session | null) => void;
export type Unsubscribe = () => void;

export type AuthRepository = {
  signIn: (credentials: SignInCredentials) => Promise<Session>;
  signUp: (credentials: SignUpCredentials) => Promise<Session>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session>;
  setSession: (session: Session) => Promise<Session>;
  getSession: () => Promise<Session | null>;
  subscribeToAuthChanges: (callback: AuthStateCallback) => Unsubscribe;
};
