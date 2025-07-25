import { z } from 'zod';

export const identitySchema = z.object({
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
});

export const ageRangeSchema = z.enum(['18-24', '25-34', '35+'], {
  required_error: 'errors.profile.ageRange.required',
  invalid_type_error: 'errors.profile.ageRange.invalid'
});

export const ageSchema = z.object({
  ageRange: ageRangeSchema,
});