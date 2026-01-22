import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { AgeRange } from '@/features/profile/domain/entities/profile';
import type { Identity, OnboardingData } from '../../domain/entities/onboarding-data';
import { identitySchema, ageSchema } from '../../domain/validation/onboarding-schema';

type OnboardingContextType = {
  data: OnboardingData;
  setIdentity: (identity: Identity) => void;
  setAgeRange: (ageRange: AgeRange) => void;
  isValidIdentity: (identity: Identity) => boolean;
  isValidAge: () => boolean;
  isValidData: () => boolean;
  getData: () => OnboardingData;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const initialData: OnboardingData = {
  firstname: '',
  lastname: '',
  ageRange: null,
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData);

  const setIdentity = (identity: Identity) => {
    setData((prev) => ({ ...prev, ...identity }));
  };

  const setAgeRange = (ageRange: AgeRange) => {
    setData((prev) => ({ ...prev, ageRange }));
  };

  const isValidIdentity = (identity: Identity): boolean => {
    return identitySchema.safeParse(identity).success;
  };

  const isValidAge = (): boolean => {
    return ageSchema.safeParse({ ageRange: data.ageRange }).success;
  };

  const isValidData = (): boolean => {
    return (
      isValidIdentity({ firstname: data.firstname, lastname: data.lastname }) && isValidAge()
    );
  };

  const getData = (): OnboardingData => data;

  const reset = () => {
    setData(initialData);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        setIdentity,
        setAgeRange,
        isValidIdentity,
        isValidAge,
        isValidData,
        getData,
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
