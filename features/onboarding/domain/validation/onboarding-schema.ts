import { z } from 'zod';
import { identitySchema, ageRangeSchema } from '@/features/profile/domain/validation/profile-schema';

export { identitySchema, ageRangeSchema };

export const ageSchema = z.object({
  ageRange: ageRangeSchema,
});
