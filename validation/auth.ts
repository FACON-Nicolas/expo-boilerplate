import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('errors.email.invalid'),
  password: z.string(),
});

export const signUpSchema = z
  .object({
    email: loginSchema.shape.email,
    password: z
      .string()
      .min(8, 'errors.password.minLength')
      .regex(/[a-z]/, 'errors.password.lowercase')
      .regex(/[A-Z]/, 'errors.password.uppercase')
      .regex(/[0-9]/, 'errors.password.number')
      .regex(/[!@#$%^&*]/, 'errors.password.specialCharacter'),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'errors.passwordConfirmation.sameAs',
  });
