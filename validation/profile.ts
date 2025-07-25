import { z } from 'zod';
import { identitySchema, ageRangeSchema } from '@/validation/onboarding';

export const profileSchema = z
  .object({
    id: z.number(),
    created_at: z.string(),
    user_id: z.string(),
    firstname: identitySchema.shape.firstname,
    lastname: identitySchema.shape.lastname,
    age_range: ageRangeSchema,
  })
  .transform((data) => ({
    id: data.id,
    firstname: data.firstname,
    lastname: data.lastname,
    ageRange: data.age_range,
    createdAt: data.created_at,
    userId: data.user_id,
  }));

export const createProfileSchema = z
  .object({
    firstname: identitySchema.shape.firstname,
    lastname: identitySchema.shape.lastname,
    ageRange: ageRangeSchema,
  })
  .transform((data) => ({
    firstname: data.firstname,
    lastname: data.lastname,
    age_range: data.ageRange,
  }));

export const updateProfileSchema = createProfileSchema.innerType().partial();
