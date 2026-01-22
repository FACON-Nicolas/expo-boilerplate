export type User = {
  id: string;
  email: string;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
  user: User;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = SignInCredentials & {
  passwordConfirmation: string;
};
