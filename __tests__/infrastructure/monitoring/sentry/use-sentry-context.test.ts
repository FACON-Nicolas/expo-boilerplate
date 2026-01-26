import * as Sentry from '@sentry/react-native';
import { renderHook } from '@testing-library/react-native';

import { useSentryContext } from '@/infrastructure/monitoring/sentry/use-sentry-context';

jest.mock('@/core/config/env', () => ({
  env: {
    EXPO_PUBLIC_SENTRY_ENABLED: true,
    EXPO_PUBLIC_SENTRY_DSN: 'https://test@sentry.io/123',
  },
}));

describe('useSentryContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setUser', () => {
    it('should call Sentry.setUser with user data', () => {
      const { result } = renderHook(() => useSentryContext());

      result.current.setUser({
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
      });

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
      });
    });

    it('should call Sentry.setUser with null to clear user', () => {
      const { result } = renderHook(() => useSentryContext());

      result.current.setUser(null);

      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });
  });

  describe('addBreadcrumb', () => {
    it('should call Sentry.addBreadcrumb', () => {
      const { result } = renderHook(() => useSentryContext());

      result.current.addBreadcrumb({
        category: 'navigation',
        message: 'User navigated to home',
        level: 'info',
        data: { screen: 'home' },
      });

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'navigation',
        message: 'User navigated to home',
        level: 'info',
        data: { screen: 'home' },
      });
    });
  });

  describe('setTag', () => {
    it('should call Sentry.setTag', () => {
      const { result } = renderHook(() => useSentryContext());

      result.current.setTag('feature', 'auth');

      expect(Sentry.setTag).toHaveBeenCalledWith('feature', 'auth');
    });
  });

  describe('captureMessage', () => {
    it('should call Sentry.captureMessage with default level', () => {
      const { result } = renderHook(() => useSentryContext());

      result.current.captureMessage('Test message');

      expect(Sentry.captureMessage).toHaveBeenCalledWith('Test message', 'info');
    });

    it('should call Sentry.captureMessage with custom level', () => {
      const { result } = renderHook(() => useSentryContext());

      result.current.captureMessage('Warning message', 'warning');

      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        'Warning message',
        'warning',
      );
    });
  });

  describe('captureException', () => {
    it('should call withScope for generic errors', () => {
      const { result } = renderHook(() => useSentryContext());
      const error = new Error('Test error');

      result.current.captureException(error);

      expect(Sentry.withScope).toHaveBeenCalled();
    });

    it('should call withScope with context', () => {
      const { result } = renderHook(() => useSentryContext());
      const error = new Error('Test error');

      result.current.captureException(error, {
        tags: { feature: 'auth' },
        extras: { userId: '123' },
      });

      expect(Sentry.withScope).toHaveBeenCalled();
    });
  });
});
