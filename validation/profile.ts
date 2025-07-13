import { z } from 'zod';

export const createProfileSchema = z.object({
  firstname: z
    .string()
    .min(1, 'errors.profile.firstname.required')
    .max(50, 'errors.profile.firstname.maxLength'),
  lastname: z
    .string()
    .min(1, 'errors.profile.lastname.required')
    .max(50, 'errors.profile.lastname.maxLength'),
});

export const updateProfileSchema = createProfileSchema.partial();
