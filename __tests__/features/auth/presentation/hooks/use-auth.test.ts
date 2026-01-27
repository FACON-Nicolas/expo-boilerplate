import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-native";
import { createElement } from "react";

import { useAuth } from "@/features/auth/presentation/hooks/use-auth";
import {
  initializeAuthStore,
  useAuthStore,
} from "@/features/auth/presentation/store/auth-store";

import type { AuthRepository } from "@/features/auth/domain/repositories/auth-repository";
import type { ReactNode } from "react";

jest.mock("@/features/auth/domain/usecases/sign-in", () => ({
  signIn: () => jest.fn(),
}));

jest.mock("@/features/auth/domain/usecases/sign-up", () => ({
  signUp: () => jest.fn(),
}));

jest.mock("@/features/auth/domain/usecases/refresh-session", () => ({
  refreshSession: () => jest.fn(),
}));

jest.mock("@/core/presentation/store/storage", () => ({
  getStorage: () => ({
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  }),
}));

const createMockRepository = (): AuthRepository => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  refreshSession: jest.fn(),
  setSession: jest.fn(),
  getSession: jest.fn().mockResolvedValue(null),
  subscribeToAuthChanges: jest.fn().mockReturnValue(() => {}),
});

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return {
    queryClient,
    Wrapper: function Wrapper({ children }: { children: ReactNode }) {
      return createElement(QueryClientProvider, { client: queryClient }, children);
    },
  };
};

describe("useAuth", () => {
  beforeEach(() => {
    initializeAuthStore(createMockRepository());
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: false,
      error: null,
    });
  });

  it("returns the full auth store state", () => {
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(result.current).toHaveProperty("user");
    expect(result.current).toHaveProperty("session");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("signIn");
    expect(result.current).toHaveProperty("signUp");
    expect(result.current).toHaveProperty("signOut");
    expect(result.current).toHaveProperty("setError");
    expect(result.current).toHaveProperty("refreshAndSetSession");
  });

  it("reflects store state changes", () => {
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(result.current.user).toBeNull();

    act(() => {
      useAuthStore.setState({
        user: { id: "user-123", email: "test@example.com" },
      });
    });

    expect(result.current.user).toEqual({
      id: "user-123",
      email: "test@example.com",
    });
  });
});
