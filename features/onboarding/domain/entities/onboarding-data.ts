import type { AgeRange } from '@/features/profile/domain/entities/profile';

export type Identity = {
  firstname: string;
  lastname: string;
};

export type OnboardingData = Identity & {
  ageRange: AgeRange | null;
};
