import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { createElement } from 'react';

import { useCreateProfile } from '@/features/profile/presentation/hooks/use-create-profile';
import { initializeProfileRepository } from '@/features/profile/presentation/store/profile-repository';

import type { CreateProfileInput, Profile } from '@/features/profile/domain/entities/profile';
import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';
import type { ReactNode } from 'react';

const mockCreateProfile = jest.fn();

jest.mock('@/features/profile/domain/usecases/create-profile', () => ({
  createProfile: () => mockCreateProfile,
}));

const createMockProfile = (overrides?: Partial<Profile>): Profile => ({
  id: 1,
  userId: 'user-123',
  firstname: 'John',
  lastname: 'Doe',
  ageRange: '25-34',
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

const createMockProfileInput = (overrides?: Partial<CreateProfileInput>): CreateProfileInput => ({
  firstname: 'John',
  lastname: 'Doe',
  ageRange: '25-34',
  ...overrides,
});

const createMockRepository = (): ProfileRepository => ({
  getProfile: jest.fn(),
  createProfile: jest.fn(),
  updateProfile: jest.fn(),
});

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return {
    queryClient,
    Wrapper: function Wrapper({ children }: { children: ReactNode }) {
      return createElement(QueryClientProvider, { client: queryClient }, children);
    },
  };
};

describe('useCreateProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    initializeProfileRepository(createMockRepository());
  });

  it('calls mutation with correct parameters', async () => {
    const mockProfile = createMockProfile();
    mockCreateProfile.mockResolvedValue(mockProfile);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateProfile(), {
      wrapper: Wrapper,
    });

    const profileInput = createMockProfileInput();
    const userId = 'user-123';

    await act(async () => {
      result.current.mutate({ profile: profileInput, userId });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockCreateProfile).toHaveBeenCalledWith(profileInput, userId);
    expect(result.current.data).toEqual(mockProfile);
  });

  it('returns loading state during mutation', async () => {
    let resolvePromise: (value: Profile) => void;
    const pendingPromise = new Promise<Profile>((resolve) => {
      resolvePromise = resolve;
    });
    mockCreateProfile.mockReturnValue(pendingPromise);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateProfile(), {
      wrapper: Wrapper,
    });

    const profileInput = createMockProfileInput();

    act(() => {
      result.current.mutate({ profile: profileInput, userId: 'user-123' });
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await act(async () => {
      resolvePromise!(createMockProfile());
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });

  it('invalidates profile cache on success', async () => {
    const mockProfile = createMockProfile();
    mockCreateProfile.mockResolvedValue(mockProfile);

    const { queryClient, Wrapper } = createQueryWrapper();

    queryClient.setQueryData(['profile', 'user-123'], null);

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateProfile(), {
      wrapper: Wrapper,
    });

    const profileInput = createMockProfileInput();

    await act(async () => {
      result.current.mutate({ profile: profileInput, userId: 'user-123' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['profile', 'user-123'] });

    invalidateQueriesSpy.mockRestore();
  });

  it('returns error state on failure', async () => {
    const error = new Error('Failed to create profile');
    mockCreateProfile.mockRejectedValue(error);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateProfile(), {
      wrapper: Wrapper,
    });

    const profileInput = createMockProfileInput();

    await act(async () => {
      result.current.mutate({ profile: profileInput, userId: 'user-123' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});
