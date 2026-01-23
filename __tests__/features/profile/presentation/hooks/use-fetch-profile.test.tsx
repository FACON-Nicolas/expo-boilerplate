import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { createElement } from 'react';

import { useFetchProfile } from '@/features/profile/presentation/hooks/use-fetch-profile';

import type { Profile } from '@/features/profile/domain/entities/profile';
import type { ReactNode } from 'react';

const mockFetchProfile = jest.fn();
const mockUser = { id: 'user-123', email: 'test@example.com' };

jest.mock('@/features/auth/presentation/hooks/use-auth', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

jest.mock('@/features/profile/domain/usecases/fetch-profile', () => ({
  fetchProfile: () => mockFetchProfile,
}));

jest.mock('@/features/profile/data/repositories/supabase-profile-repository', () => ({
  createSupabaseProfileRepository: jest.fn(() => ({})),
}));

jest.mock('@/infrastructure/supabase/client', () => ({
  supabaseClient: {},
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

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useFetchProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches profile when user is authenticated', async () => {
    const mockProfile = createMockProfile();
    mockFetchProfile.mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useFetchProfile(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProfile);
    expect(mockFetchProfile).toHaveBeenCalled();
  });

  it('returns loading state initially', () => {
    mockFetchProfile.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFetchProfile(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns error state on failure', async () => {
    mockFetchProfile.mockRejectedValue(new Error('Profile not found'));

    const { result } = renderHook(() => useFetchProfile(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error('Profile not found'));
  });

  it('includes user id in query key', async () => {
    const mockProfile = createMockProfile();
    mockFetchProfile.mockResolvedValue(mockProfile);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    renderHook(() => useFetchProfile(), {
      wrapper: ({ children }) =>
        createElement(QueryClientProvider, { client: queryClient }, children),
    });

    await waitFor(() => {
      const cache = queryClient.getQueryCache();
      const queries = cache.findAll();
      expect(queries.some((q) => JSON.stringify(q.queryKey).includes('user-123'))).toBe(true);
    });
  });
});
