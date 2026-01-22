export type AgeRange = '18-24' | '25-34' | '35+';

export type Profile = {
  id: number;
  userId: string;
  firstname: string;
  lastname: string;
  ageRange: AgeRange;
  createdAt: string;
};

export type CreateProfileInput = {
  firstname: string;
  lastname: string;
  ageRange: AgeRange;
};

export type UpdateProfileInput = Partial<CreateProfileInput>;
