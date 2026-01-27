import * as Sentry from '@sentry/react-native';

import { captureAppError, captureError } from '@/core/data/monitoring/sentry-error-reporter';
import { AppError } from '@/core/domain/errors/app-error';

describe('sentry-error-reporter', () => {
  const mockScope = {
    setLevel: jest.fn(),
    setTag: jest.fn(),
    setExtra: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Sentry.withScope as jest.Mock).mockImplementation((callback) =>
      callback(mockScope),
    );
  });

  describe('captureAppError', () => {
    it('should set correct severity for UNKNOWN errors', () => {
      const error = new AppError('Unknown error', 'UNKNOWN');

      captureAppError(error);

      expect(mockScope.setLevel).toHaveBeenCalledWith('error');
      expect(mockScope.setTag).toHaveBeenCalledWith('app_error_code', 'UNKNOWN');
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it('should set correct severity for VALIDATION errors', () => {
      const error = AppError.validation('Invalid email');

      captureAppError(error);

      expect(mockScope.setLevel).toHaveBeenCalledWith('warning');
      expect(mockScope.setTag).toHaveBeenCalledWith(
        'app_error_code',
        'VALIDATION',
      );
    });

    it('should set correct severity for NETWORK errors', () => {
      const error = AppError.network('Connection failed');

      captureAppError(error);

      expect(mockScope.setLevel).toHaveBeenCalledWith('warning');
      expect(mockScope.setTag).toHaveBeenCalledWith('app_error_code', 'NETWORK');
    });

    it('should set correct severity for UNAUTHORIZED errors', () => {
      const error = AppError.unauthorized();

      captureAppError(error);

      expect(mockScope.setLevel).toHaveBeenCalledWith('info');
      expect(mockScope.setTag).toHaveBeenCalledWith(
        'app_error_code',
        'UNAUTHORIZED',
      );
    });

    it('should set correct severity for NOT_FOUND errors', () => {
      const error = AppError.notFound('User not found');

      captureAppError(error);

      expect(mockScope.setLevel).toHaveBeenCalledWith('info');
      expect(mockScope.setTag).toHaveBeenCalledWith(
        'app_error_code',
        'NOT_FOUND',
      );
    });

    it('should include original error as extra', () => {
      const originalError = new Error('Original');
      const error = new AppError('Wrapped error', 'UNKNOWN', originalError);

      captureAppError(error);

      expect(mockScope.setExtra).toHaveBeenCalledWith(
        'original_error',
        originalError,
      );
    });

    it('should add custom tags and extras', () => {
      const error = new AppError('Test', 'UNKNOWN');

      captureAppError(error, {
        tags: { feature: 'auth', action: 'login' },
        extras: { userId: '123', attempt: 3 },
      });

      expect(mockScope.setTag).toHaveBeenCalledWith('feature', 'auth');
      expect(mockScope.setTag).toHaveBeenCalledWith('action', 'login');
      expect(mockScope.setExtra).toHaveBeenCalledWith('userId', '123');
      expect(mockScope.setExtra).toHaveBeenCalledWith('attempt', 3);
    });
  });

  describe('captureError', () => {
    it('should delegate AppError to captureAppError', () => {
      const error = new AppError('App error', 'VALIDATION');

      captureError(error);

      expect(mockScope.setTag).toHaveBeenCalledWith(
        'app_error_code',
        'VALIDATION',
      );
    });

    it('should capture generic errors directly', () => {
      const error = new Error('Generic error');

      captureError(error);

      expect(Sentry.captureException).toHaveBeenCalledWith(error);
      expect(mockScope.setTag).not.toHaveBeenCalledWith(
        'app_error_code',
        expect.any(String),
      );
    });

    it('should add tags and extras for generic errors', () => {
      const error = new Error('Generic error');

      captureError(error, {
        tags: { source: 'api' },
        extras: { endpoint: '/users' },
      });

      expect(mockScope.setTag).toHaveBeenCalledWith('source', 'api');
      expect(mockScope.setExtra).toHaveBeenCalledWith('endpoint', '/users');
    });
  });
});

