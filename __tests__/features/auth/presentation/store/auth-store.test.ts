import { act, renderHook } from "@testing-library/react-native";

import { AppError } from "@/core/domain/errors/app-error";
import { useAuthStore } from "@/features/auth/presentation/store/auth-store";

import type { Session } from "@/features/auth/domain/entities/session";

const mockSignInUsecase = jest.fn();
const mockSignUpUsecase = jest.fn();
const mockRefreshSessionUsecase = jest.fn();

jest.mock("@/features/auth/domain/usecases/sign-in", () => ({
  signIn: () => mockSignInUsecase,
}));

jest.mock("@/features/auth/domain/usecases/sign-up", () => ({
  signUp: () => mockSignUpUsecase,
}));

jest.mock("@/features/auth/domain/usecases/refresh-session", () => ({
  refreshSession: () => mockRefreshSessionUsecase,
}));

const mockRepositorySignOut = jest.fn();
jest.mock("@/features/auth/data/repositories/supabase-auth-repository", () => ({
  createSupabaseAuthRepository: () => ({
    signOut: (...args: unknown[]) => mockRepositorySignOut(...args),
  }),
}));

jest.mock("@/infrastructure/supabase/client", () => ({
  supabaseClient: {},
}));

jest.mock("@/core/data/storage/secure-storage", () => ({
  secureStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const createMockSession = (overrides?: Partial<Session>): Session => ({
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  expiresAt: Date.now() + 3600000,
  user: { id: "user-123", email: "test@example.com" },
  ...overrides,
});

describe("auth-store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: false,
      error: null,
    });
  });

  describe("initial state", () => {
    it("has null user and session", () => {
      const { result } = renderHook(() => useAuthStore((state) => state));

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("signIn", () => {
    it("sets isLoading to true while signing in", async () => {
      const mockSession = createMockSession();
      let resolvePromise: (value: Session) => void;
      const pendingPromise = new Promise<Session>((resolve) => {
        resolvePromise = resolve;
      });
      mockSignInUsecase.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => useAuthStore((state) => state));

      act(() => {
        result.current.signIn({
          email: "test@example.com",
          password: "password",
        });
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!(mockSession);
        await pendingPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("sets user and session on successful sign in", async () => {
      const mockSession = createMockSession();
      mockSignInUsecase.mockResolvedValue(mockSession);

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.signIn({
          email: "test@example.com",
          password: "password",
        });
      });

      expect(result.current.user).toEqual(mockSession.user);
      expect(result.current.session).toEqual(mockSession);
      expect(result.current.error).toBeNull();
    });

    it("sets error on failed sign in", async () => {
      mockSignInUsecase.mockRejectedValue(new Error("Invalid credentials"));

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.signIn({
          email: "test@example.com",
          password: "wrong",
        });
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.error).toBeInstanceOf(AppError);
      expect(result.current.error?.message).toBe("Invalid credentials");
    });
  });

  describe("signUp", () => {
    it("sets user and session on successful sign up", async () => {
      const mockSession = createMockSession({
        user: { id: "new-user", email: "new@example.com" },
      });
      mockSignUpUsecase.mockResolvedValue(mockSession);

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.signUp({
          email: "new@example.com",
          password: "Password123!",
          passwordConfirmation: "Password123!",
        });
      });

      expect(result.current.user).toEqual(mockSession.user);
      expect(result.current.session).toEqual(mockSession);
    });

    it("sets error on failed sign up", async () => {
      mockSignUpUsecase.mockRejectedValue(new Error("User already exists"));

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.signUp({
          email: "existing@example.com",
          password: "Password123!",
          passwordConfirmation: "Password123!",
        });
      });

      expect(result.current.error).toBeInstanceOf(AppError);
      expect(result.current.error?.message).toBe("User already exists");
    });
  });

  describe("signOut", () => {
    it("clears user and session on successful signOut", async () => {
      mockRepositorySignOut.mockResolvedValue(undefined);
      useAuthStore.setState({
        user: { id: "user-123", email: "test@example.com" },
        session: createMockSession(),
      });

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockRepositorySignOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("sets error on signOut failure", async () => {
      mockRepositorySignOut.mockRejectedValue(new Error("SignOut failed"));
      useAuthStore.setState({
        user: { id: "user-123", email: "test@example.com" },
        session: createMockSession(),
      });

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.error).toBeInstanceOf(AppError);
      expect(result.current.error?.message).toBe("SignOut failed");
    });
  });

  describe("setError", () => {
    it("sets the error state", () => {
      const { result } = renderHook(() => useAuthStore((state) => state));
      const customError = AppError.validation("Custom error message");

      act(() => {
        result.current.setError(customError);
      });

      expect(result.current.error).toBe(customError);
    });

    it("clears the error when set to null", () => {
      useAuthStore.setState({ error: AppError.validation("Previous error") });

      const { result } = renderHook(() => useAuthStore((state) => state));

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("clearError", () => {
    it("clears the error state", () => {
      useAuthStore.setState({ error: AppError.validation("Some error") });

      const { result } = renderHook(() => useAuthStore((state) => state));

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("refreshAndSetSession", () => {
    it("updates session with refreshed data", async () => {
      const currentSession = createMockSession();
      const refreshedSession = createMockSession({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });
      mockRefreshSessionUsecase.mockResolvedValue(refreshedSession);

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.refreshAndSetSession(currentSession);
      });

      expect(result.current.session).toEqual(refreshedSession);
      expect(result.current.user).toEqual(refreshedSession.user);
    });

    it("sets error on refresh failure", async () => {
      const currentSession = createMockSession();
      mockRefreshSessionUsecase.mockRejectedValue(new Error("Session expired"));

      const { result } = renderHook(() => useAuthStore((state) => state));

      await act(async () => {
        await result.current.refreshAndSetSession(currentSession);
      });

      expect(result.current.error).toBeInstanceOf(AppError);
      expect(result.current.error?.message).toBe("Session expired");
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });
  });
});
