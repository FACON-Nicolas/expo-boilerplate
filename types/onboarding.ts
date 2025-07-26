import { z } from 'zod';
import { identitySchema, ageSchema, ageRangeSchema } from '@/validation/onboarding';

export type Identity = z.infer<typeof identitySchema>;
export type AgeSelection = z.infer<typeof ageSchema>;
export type AgeRange = z.infer<typeof ageRangeSchema>;