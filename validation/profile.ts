import { z } from 'zod';

export const profileSchema = z
  .object({
    id: z.number(),
    created_at: z.date(),
    user_id: z.string(),
    firstname: z
      .string()
      .trim()
      .min(1, 'errors.profile.firstname.required')
      .max(50, 'errors.profile.firstname.maxLength'),
    lastname: z
      .string()
      .trim()
      .min(1, 'errors.profile.lastname.required')
      .max(50, 'errors.profile.lastname.maxLength'),
  })
  .transform((data) => ({
    id: data.id,
    firstname: data.firstname,
    lastname: data.lastname,
    createdAt: data.created_at,
    userId: data.user_id,
  }));

export const createProfileSchema = z.object({
  firstname: profileSchema.innerType().shape.firstname,
  lastname: profileSchema.innerType().shape.lastname,
});

export const updateProfileSchema = createProfileSchema.partial();
