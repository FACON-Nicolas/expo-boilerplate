import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AgeRange, Identity } from '@/types/onboarding';
import { identitySchema, ageSchema } from '@/validation/onboarding';

type OnboardingProfile = {
  firstname: string;
  lastname: string;
  ageRange: AgeRange | null;
};

interface OnboardingContextType {
  profile: OnboardingProfile;
  setIdentity: (identity: Identity) => void;
  setAgeRange: (ageRange: AgeRange) => void;
  isValidIdentity: (identity: Identity) => boolean;
  isValidAge: () => boolean;
  isValidProfile: () => boolean;
  getProfile: () => OnboardingProfile;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

const initialData: OnboardingProfile = {
  firstname: '',
  lastname: '',
  ageRange: null,
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<OnboardingProfile>(initialData);

  const setIdentity = (identity: Identity) => {
    setProfile((prev) => ({ ...prev, ...identity }));
  };

  const setAgeRange = (ageRange: AgeRange) => {
    setProfile((prev) => ({ ...prev, ageRange }));
  };

  const isValidIdentity = (identity: Identity): boolean => {
    return identitySchema.safeParse(identity).success;
  };

  const isValidAge = (): boolean => {
    return ageSchema.safeParse({
      ageRange: profile.ageRange,
    }).success;
  };

  const isValidProfile = (): boolean => {
    return (
      isValidIdentity({
        firstname: profile.firstname,
        lastname: profile.lastname,
      }) && isValidAge()
    );
  };

  const getProfile = (): OnboardingProfile => {
    return profile;
  };

  const reset = () => {
    setProfile(initialData);
  };

  return (
    <OnboardingContext.Provider
      value={{
        profile,
        setIdentity,
        setAgeRange,
        isValidIdentity,
        isValidAge,
        isValidProfile,
        getProfile,
        reset,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
