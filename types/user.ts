export type SignInUser = {
  email: string;
  password: string;
};

export type SignUpUser = SignInUser & {
  passwordConfirmation: string;
};
