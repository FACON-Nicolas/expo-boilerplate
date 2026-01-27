import * as Sentry from '@sentry/react-native';
import { renderHook } from '@testing-library/react-native';

import { useSentryContext } from '@/core/presentation/hooks/use-sentry-context';

const mockReportError = jest.fn();

const createDependencies = (isEnabled = true) => ({
  isEnabled,
  reportError: mockReportError,
});

describe('useSentryContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setUser', () => {
    it('should call Sentry.setUser with user data', () => {
      const { result } = renderHook(() => useSentryContext(createDependencies()));

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
      const { result } = renderHook(() => useSentryContext(createDependencies()));

      result.current.setUser(null);

      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });

    it('should not call Sentry.setUser when disabled', () => {
      const { result } = renderHook(() => useSentryContext(createDependencies(false)));

      result.current.setUser({ id: 'user-123' });

      expect(Sentry.setUser).not.toHaveBeenCalled();
    });
  });

  describe('addBreadcrumb', () => {
    it('should call Sentry.addBreadcrumb', () => {
      const { result } = renderHook(() => useSentryContext(createDependencies()));

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
      const { result } = renderHook(() => useSentryContext(createDependencies()));

      result.current.setTag('feature', 'auth');

      expect(Sentry.setTag).toHaveBeenCalledWith('feature', 'auth');
    });
  });

  describe('captureMessage', () => {
    it('should call Sentry.captureMessage with default level', () => {
      const { result } = renderHook(() => useSentryContext(createDependencies()));

      result.current.captureMessage('Test message');

      expect(Sentry.captureMessage).toHaveBeenCalledWith('Test message', 'info');
    });

    it('should call Sentry.captureMessage with custom level', () => {
      const { result } = renderHook(() => useSentryContext(createDependencies()));

      result.current.captureMessage('Warning message', 'warning');

      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        'Warning message',
        'warning',
      );
    });
  });

  describe('captureException', () => {
    it('should call reportError for errors', () => {
      const { result } = renderHook(() => useSentryContext(createDependencies()));
      const error = new Error('Test error');

      result.current.captureException(error);

      expect(mockReportError).toHaveBeenCalledWith(error, undefined);
    });

    it('should call reportError with context', () => {
      const { result } = renderHook(() => useSentryContext(createDependencies()));
      const error = new Error('Test error');
      const context = { tags: { feature: 'auth' }, extras: { userId: '123' } };

      result.current.captureException(error, context);

      expect(mockReportError).toHaveBeenCalledWith(error, context);
    });

    it('should not call reportError when disabled', () => {
      const { result } = renderHook(() => useSentryContext(createDependencies(false)));
      const error = new Error('Test error');

      result.current.captureException(error);

      expect(mockReportError).not.toHaveBeenCalled();
    });
  });
});

