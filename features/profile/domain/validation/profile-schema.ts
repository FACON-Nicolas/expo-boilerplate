import { z } from "zod";

export const ageRangeSchema = z.enum(["18-24", "25-34", "35+"], {
  required_error: "errors.profile.ageRange.required",
  invalid_type_error: "errors.profile.ageRange.invalid",
});

export const identitySchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, "errors.profile.firstname.required")
    .max(50, "errors.profile.firstname.maxLength"),
  lastname: z
    .string()
    .trim()
    .min(1, "errors.profile.lastname.required")
    .max(50, "errors.profile.lastname.maxLength"),
});

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

const createProfileInputSchema = z.object({
  firstname: identitySchema.shape.firstname,
  lastname: identitySchema.shape.lastname,
  ageRange: ageRangeSchema,
});

export const createProfileSchema = createProfileInputSchema.transform(
  (data) => ({
    firstname: data.firstname,
    lastname: data.lastname,
    age_range: data.ageRange,
  }),
);

export const updateProfileSchema = createProfileInputSchema.partial();

export type CreateProfileInput = z.input<typeof createProfileSchema>;
export type CreateProfileOutput = z.output<typeof createProfileSchema>;
export type UpdateProfileInput = z.input<typeof updateProfileSchema>;
export type UpdateProfileOutput = z.output<typeof updateProfileSchema>;
