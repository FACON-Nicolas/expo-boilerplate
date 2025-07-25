import { z } from 'zod';
import {
  createProfileSchema,
  profileSchema,
  updateProfileSchema,
} from '@/validation/profile';

export type Profile = z.output<typeof profileSchema>;
export type FetchedProfile = z.input<typeof profileSchema>;
export type CreateProfile = z.input<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
